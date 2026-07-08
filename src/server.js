const http = require("node:http");
const { URL } = require("node:url");
const data = require("./procedures.json");

const PORT = Number(process.env.PORT || 3000);
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "doi_token_xac_minh_webhook";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "";
const AGENCY_NAME = process.env.AGENCY_NAME || "Bộ phận Một cửa";
const AGENCY_ADDRESS = process.env.AGENCY_ADDRESS || "Vui lòng cập nhật địa chỉ cơ quan";
const AGENCY_PHONE = process.env.AGENCY_PHONE || "Vui lòng cập nhật số điện thoại";
const PUBLIC_SERVICE_PORTAL_URL =
  process.env.PUBLIC_SERVICE_PORTAL_URL || "https://dichvucong.gov.vn";

const helpText =
  "Tôi có thể hỗ trợ tra cứu thủ tục hành chính phổ biến. Bạn có thể hỏi: khai sinh, chứng thực, cư trú, hộ kinh doanh, xây dựng, đất đai, phản ánh kiến nghị, giờ làm việc.";

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đ]/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderProcedure(procedure) {
  const documents = procedure.documents.map((item) => `- ${item}`).join("\n");
  return [
    `Thủ tục: ${procedure.title}`,
    "",
    `Cơ quan tiếp nhận: ${procedure.receiver}`,
    `Thời hạn xử lý: ${procedure.processingTime}`,
    `Lệ phí: ${procedure.fee}`,
    "",
    "Hồ sơ thường cần:",
    documents,
    "",
    `Cách thực hiện: ${procedure.howToApply}`,
    procedure.note ? `Lưu ý: ${procedure.note}` : "",
    "",
    `Nộp trực tuyến/tham khảo: ${procedure.link || PUBLIC_SERVICE_PORTAL_URL}`,
    "",
    "Thông tin có thể thay đổi theo địa phương. Nếu bạn cần hồ sơ chính xác cho trường hợp cụ thể, hãy nhắn thêm xã/phường/quận/huyện hoặc gọi bộ phận tiếp nhận."
  ]
    .filter(Boolean)
    .join("\n");
}

function renderOfficeInfo() {
  return [
    `${AGENCY_NAME}`,
    `Địa chỉ: ${AGENCY_ADDRESS}`,
    `Điện thoại: ${AGENCY_PHONE}`,
    `Cổng dịch vụ công: ${PUBLIC_SERVICE_PORTAL_URL}`,
    "",
    "Thời gian làm việc thường áp dụng: giờ hành chính từ thứ 2 đến thứ 6. Vui lòng cập nhật lịch cụ thể của địa phương trong biến môi trường hoặc dữ liệu FAQ."
  ].join("\n");
}

function findProcedure(message) {
  const normalizedMessage = normalizeText(message);
  return data.procedures.find((procedure) =>
    procedure.keywords.some((keyword) =>
      normalizedMessage.includes(normalizeText(keyword))
    )
  );
}

function buildReply(message) {
  const normalizedMessage = normalizeText(message);

  if (!normalizedMessage) {
    return helpText;
  }

  if (["bat dau", "start", "menu", "tro giup", "help"].some((item) => normalizedMessage.includes(item))) {
    return `${helpText}\n\n${renderOfficeInfo()}`;
  }

  if (
    ["gio lam viec", "dia chi", "so dien thoai", "lien he", "mot cua"].some((item) =>
      normalizedMessage.includes(item)
    )
  ) {
    return renderOfficeInfo();
  }

  const procedure = findProcedure(message);
  if (procedure) {
    return renderProcedure(procedure);
  }

  return [
    "Tôi chưa tìm thấy thủ tục phù hợp trong kho FAQ hiện tại.",
    helpText,
    "",
    "Bạn có thể mô tả rõ hơn nhu cầu, ví dụ: “xin cấp giấy khai sinh”, “chứng thực bản sao”, “đăng ký tạm trú”. Nếu vẫn chưa có kết quả, cán bộ phụ trách sẽ cần kiểm tra và phản hồi."
  ].join("\n");
}

function readJsonBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        request.destroy();
        reject(new Error("Payload quá lớn"));
      }
    });
    request.on("end", () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

async function sendFacebookMessage(recipientId, text) {
  if (!PAGE_ACCESS_TOKEN) {
    console.log("[dry-run] Reply to", recipientId, text);
    return;
  }

  const facebookResponse = await fetch(
    `https://graph.facebook.com/v20.0/me/messages?access_token=${encodeURIComponent(PAGE_ACCESS_TOKEN)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text }
      })
    }
  );

  if (!facebookResponse.ok) {
    const errorText = await facebookResponse.text();
    throw new Error(`Facebook API error ${facebookResponse.status}: ${errorText}`);
  }
}

async function handleWebhookEvent(event) {
  const senderId = event.sender && event.sender.id;
  const text = event.message && event.message.text;

  if (!senderId || !text) {
    return;
  }

  await sendFacebookMessage(senderId, buildReply(text));
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  if (request.method === "GET" && requestUrl.pathname === "/health") {
    sendJson(response, 200, { ok: true, service: "hanh-chinh-cong-fanpage-bot" });
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/webhook") {
    const mode = requestUrl.searchParams.get("hub.mode");
    const token = requestUrl.searchParams.get("hub.verify_token");
    const challenge = requestUrl.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(challenge || "");
      return;
    }

    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/webhook") {
    const body = await readJsonBody(request);

    if (body.object !== "page") {
      sendJson(response, 404, { ok: false });
      return;
    }

    const events = body.entry
      .flatMap((entry) => entry.messaging || [])
      .filter((event) => event.message && !event.message.is_echo);

    await Promise.all(events.map(handleWebhookEvent));
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/test-reply") {
    const body = await readJsonBody(request);
    sendJson(response, 200, { reply: buildReply(body.message || "") });
    return;
  }

  sendJson(response, 404, { ok: false, message: "Not found" });
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error(error);
    sendJson(response, 500, { ok: false, message: "Internal server error" });
  });
});

server.listen(PORT, () => {
  console.log(`Fanpage bot đang chạy tại http://localhost:${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
});

