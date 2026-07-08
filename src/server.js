const http = require("node:http");

const { URL } = require("node:url");
const data = require("./procedures.json");
require("dotenv").config();
const PORT = Number(process.env.PORT || 3000);
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "doi_token_xac_minh_webhook";
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || "";
const AGENCY_NAME = process.env.AGENCY_NAME || "Bộ phận Một cửa";
const AGENCY_ADDRESS =
  process.env.AGENCY_ADDRESS || "Vui lòng cập nhật địa chỉ cơ quan";
const AGENCY_PHONE =
  process.env.AGENCY_PHONE || "Vui lòng cập nhật số điện thoại";
const PUBLIC_SERVICE_PORTAL_URL =
  process.env.PUBLIC_SERVICE_PORTAL_URL || "https://dichvucong.gov.vn";

const helpText =
  "Tôi có thể hỗ trợ tra cứu thủ tục hành chính phổ biến. Bạn có thể hỏi: khai sinh, chứng thực, cư trú, hộ kinh doanh, xây dựng, đất đai, phản ánh kiến nghị, giờ làm việc.";

function logApi(event, details = {}) {
  console.log(
    JSON.stringify({
      time: new Date().toISOString(),
      event,
      ...details,
    }),
  );
}

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
    "Thông tin có thể thay đổi theo địa phương. Nếu bạn cần hồ sơ chính xác cho trường hợp cụ thể, hãy nhắn thêm xã/phường/quận/huyện hoặc gọi bộ phận tiếp nhận.",
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
    "Thời gian làm việc thường áp dụng: giờ hành chính từ thứ 2 đến thứ 6. Vui lòng cập nhật lịch cụ thể của địa phương trong biến môi trường hoặc dữ liệu FAQ.",
  ].join("\n");
}

function findProcedure(message) {
  const normalizedMessage = normalizeText(message);
  return data.procedures.find((procedure) =>
    procedure.keywords.some((keyword) =>
      normalizedMessage.includes(normalizeText(keyword)),
    ),
  );
}

function buildReply(message) {
  const normalizedMessage = normalizeText(message);

  if (!normalizedMessage) {
    return helpText;
  }

  if (
    ["bat dau", "start", "menu", "tro giup", "help"].some((item) =>
      normalizedMessage.includes(item),
    )
  ) {
    return `${helpText}\n\n${renderOfficeInfo()}`;
  }

  if (
    ["gio lam viec", "dia chi", "so dien thoai", "lien he", "mot cua"].some(
      (item) => normalizedMessage.includes(item),
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
    "Bạn có thể mô tả rõ hơn nhu cầu, ví dụ: “xin cấp giấy khai sinh”, “chứng thực bản sao”, “đăng ký tạm trú”. Nếu vẫn chưa có kết quả, cán bộ phụ trách sẽ cần kiểm tra và phản hồi.",
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
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

async function sendFacebookMessage(recipientId, text) {
  if (!PAGE_ACCESS_TOKEN) {
    logApi("facebook_message_dry_run", {
      recipientId,
      textLength: text.length,
      preview: text.slice(0, 120),
    });
    return;
  }

  logApi("facebook_message_send", {
    recipientId,
    textLength: text.length,
  });

  const facebookResponse = await fetch(
    `https://graph.facebook.com/v20.0/me/messages?access_token=${encodeURIComponent(PAGE_ACCESS_TOKEN)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    },
  );

  if (!facebookResponse.ok) {
    const errorText = await facebookResponse.text();
    logApi("facebook_message_error", {
      recipientId,
      status: facebookResponse.status,
      error: errorText.slice(0, 500),
    });
    throw new Error(
      `Facebook API error ${facebookResponse.status}: ${errorText}`,
    );
  }

  logApi("facebook_message_sent", {
    recipientId,
    status: facebookResponse.status,
  });
}

async function handleWebhookEvent(event) {
  const senderId = event.sender && event.sender.id;
  const text = event.message && event.message.text;

  if (!senderId || !text) {
    logApi("webhook_event_ignored", {
      hasSenderId: Boolean(senderId),
      hasText: Boolean(text),
    });
    return;
  }

  logApi("webhook_message_received", {
    senderId,
    textLength: text.length,
    preview: text.slice(0, 120),
  });

  await sendFacebookMessage(senderId, buildReply(text));
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const startedAt = Date.now();

  logApi("api_request_start", {
    method: request.method,
    path: requestUrl.pathname,
    query: Object.fromEntries(requestUrl.searchParams.entries()),
    remoteAddress: request.socket.remoteAddress,
  });

  response.on("finish", () => {
    logApi("api_request_finish", {
      method: request.method,
      path: requestUrl.pathname,
      statusCode: response.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  if (request.method === "GET" && requestUrl.pathname === "/") {
    logApi("root_check");
    sendJson(response, 200, {
      ok: true,
      service: "hanh-chinh-cong-fanpage-bot",
      health: "/health",
      webhook: "/webhook",
    });
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/favicon.ico") {
    logApi("favicon_ignored");
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/health") {
    logApi("health_check");
    sendJson(response, 200, {
      ok: true,
      service: "hanh-chinh-cong-fanpage-bot",
    });
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/webhook") {
    const mode = requestUrl.searchParams.get("hub.mode");
    const token = requestUrl.searchParams.get("hub.verify_token");
    const challenge = requestUrl.searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      logApi("webhook_verify_success", {
        mode,
        hasChallenge: Boolean(challenge),
      });
      response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(challenge || "");
      return;
    }

    logApi("webhook_verify_failed", {
      mode,
      hasToken: Boolean(token),
    });
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Forbidden");
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/webhook") {
    const body = await readJsonBody(request);

    if (body.object !== "page") {
      logApi("webhook_post_ignored", {
        object: body.object || null,
      });
      sendJson(response, 404, { ok: false });
      return;
    }

    const events = body.entry
      .flatMap((entry) => entry.messaging || [])
      .filter((event) => event.message && !event.message.is_echo);

    logApi("webhook_post_received", {
      entryCount: Array.isArray(body.entry) ? body.entry.length : 0,
      eventCount: events.length,
    });

    await Promise.all(events.map(handleWebhookEvent));
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/test-reply") {
    const body = await readJsonBody(request);
    const message = body.message || "";
    const reply = buildReply(message);
    logApi("test_reply", {
      messageLength: message.length,
      messagePreview: message.slice(0, 120),
      replyLength: reply.length,
      replyPreview: reply.slice(0, 120),
    });
    sendJson(response, 200, { reply });
    return;
  }

  logApi("api_not_found", {
    method: request.method,
    path: requestUrl.pathname,
  });
  sendJson(response, 404, { ok: false, message: "Not found" });
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    logApi("api_error", {
      message: error.message,
      stack: error.stack,
    });
    sendJson(response, 500, { ok: false, message: "Internal server error" });
  });
});

server.listen(PORT, () => {
  console.log(`Fanpage bot đang chạy tại http://localhost:${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
});
