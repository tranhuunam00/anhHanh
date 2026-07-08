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

function sendHtml(response, statusCode, html) {
  response.writeHead(statusCode, { "Content-Type": "text/html; charset=utf-8" });
  response.end(html);
}

function renderPrivacyPolicyPage() {
  const updatedAt = "08/07/2026";

  return `<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Chinh sach quyen rieng tu</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      background: #f8fafc;
    }
    main {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 20px;
      background: #ffffff;
      min-height: 100vh;
    }
    h1, h2 {
      color: #0f172a;
      line-height: 1.25;
    }
    h1 {
      margin-top: 0;
      font-size: 30px;
    }
    h2 {
      margin-top: 28px;
      font-size: 20px;
    }
    p, li {
      font-size: 16px;
    }
    .muted {
      color: #64748b;
    }
  </style>
</head>
<body>
  <main>
    <h1>Ch&iacute;nh s&aacute;ch quy&#7873;n ri&ecirc;ng t&#432;</h1>
    <p class="muted">C&#7853;p nh&#7853;t l&#7847;n cu&#7889;i: ${updatedAt}</p>

    <p>
      Ch&iacute;nh s&aacute;ch n&agrave;y m&ocirc; t&#7843; c&aacute;ch chatbot Fanpage c&#7911;a ${AGENCY_NAME}
      ti&#7871;p nh&#7853;n, s&#7917; d&#7909;ng v&agrave; b&#7843;o v&#7879; th&ocirc;ng tin khi ng&#432;&#7901;i d&ugrave;ng
      nh&#7855;n tin qua Facebook Messenger.
    </p>

    <h2>1. Th&ocirc;ng tin &#273;&#432;&#7907;c ti&#7871;p nh&#7853;n</h2>
    <p>Khi ng&#432;&#7901;i d&ugrave;ng nh&#7855;n tin cho Fanpage, h&#7879; th&#7889;ng c&oacute; th&#7875; ti&#7871;p nh&#7853;n:</p>
    <ul>
      <li>N&#7897;i dung tin nh&#7855;n ng&#432;&#7901;i d&ugrave;ng g&#7917;i.</li>
      <li>M&atilde; &#273;&#7883;nh danh ng&#432;&#7901;i g&#7917;i do Facebook cung c&#7845;p &#273;&#7875; ph&#7843;n h&#7891;i &#273;&uacute;ng cu&#7897;c tr&ograve; chuy&#7879;n.</li>
      <li>Th&#7901;i &#273;i&#7875;m g&#7917;i tin nh&#7855;n v&agrave; tr&#7841;ng th&aacute;i x&#7917; l&yacute; k&#7929; thu&#7853;t.</li>
    </ul>

    <h2>2. M&#7909;c &#273;&iacute;ch s&#7917; d&#7909;ng th&ocirc;ng tin</h2>
    <p>Th&ocirc;ng tin &#273;&#432;&#7907;c s&#7917; d&#7909;ng &#273;&#7875;:</p>
    <ul>
      <li>Tr&#7843; l&#7901;i t&#7921; &#273;&#7897;ng c&aacute;c c&acirc;u h&#7887;i v&#7873; th&#7911; t&#7909;c h&agrave;nh ch&iacute;nh, th&ocirc;ng tin li&ecirc;n h&#7879; v&agrave; h&#432;&#7899;ng d&#7851;n n&#7897;p h&#7891; s&#417;.</li>
      <li>Ghi nh&#7853;n l&#7895;i k&#7929; thu&#7853;t v&agrave; c&#7843;i thi&#7879;n ch&#7845;t l&#432;&#7907;ng h&#7895; tr&#7907;.</li>
      <li>Chuy&#7875;n ti&#7871;p n&#7897;i dung cho c&aacute;n b&#7897; ph&#7909; tr&aacute;ch khi c&acirc;u h&#7887;i c&#7847;n x&#7917; l&yacute; th&#7911; c&ocirc;ng.</li>
    </ul>

    <h2>3. Kh&ocirc;ng thu th&#7853;p th&ocirc;ng tin kh&ocirc;ng c&#7847;n thi&#7871;t</h2>
    <p>
      Chatbot kh&ocirc;ng y&ecirc;u c&#7847;u ng&#432;&#7901;i d&ugrave;ng cung c&#7845;p m&#7853;t kh&#7849;u, m&atilde; OTP,
      th&ocirc;ng tin th&#7867; ng&acirc;n h&agrave;ng ho&#7863;c d&#7919; li&#7879;u nh&#7841;y c&#7843;m kh&ocirc;ng c&#7847;n thi&#7871;t.
    </p>

    <h2>4. Chia s&#7867; th&ocirc;ng tin</h2>
    <p>
      Th&ocirc;ng tin tin nh&#7855;n ch&#7881; &#273;&#432;&#7907;c s&#7917; d&#7909;ng cho m&#7909;c &#273;&iacute;ch h&#7895; tr&#7907; h&agrave;nh ch&iacute;nh c&ocirc;ng
      v&agrave; v&#7853;n h&agrave;nh h&#7879; th&#7889;ng. Ch&uacute;ng t&ocirc;i kh&ocirc;ng b&aacute;n, trao &#273;&#7893;i ho&#7863;c chia s&#7867;
      th&ocirc;ng tin c&aacute; nh&acirc;n cho b&ecirc;n th&#7913; ba v&igrave; m&#7909;c &#273;&iacute;ch th&#432;&#417;ng m&#7841;i.
    </p>

    <h2>5. L&#432;u tr&#7919; v&agrave; b&#7843;o m&#7853;t</h2>
    <p>
      D&#7919; li&#7879;u k&#7929; thu&#7853;t v&agrave; n&#7897;i dung h&#7897;i tho&#7841;i, n&#7871;u &#273;&#432;&#7907;c l&#432;u, s&#7869; &#273;&#432;&#7907;c gi&#7899;i h&#7841;n
      quy&#7873;n truy c&#7853;p cho ng&#432;&#7901;i c&oacute; tr&aacute;ch nhi&#7879;m v&#7853;n h&agrave;nh ho&#7863;c x&#7917; l&yacute; y&ecirc;u c&#7847;u.
    </p>

    <h2>6. Quy&#7873;n c&#7911;a ng&#432;&#7901;i d&ugrave;ng</h2>
    <p>
      Ng&#432;&#7901;i d&ugrave;ng c&oacute; th&#7875; y&ecirc;u c&#7847;u ki&#7875;m tra, &#273;i&#7873;u ch&#7881;nh ho&#7863;c x&oacute;a th&ocirc;ng tin &#273;&atilde; g&#7917;i
      qua Fanpage b&#7857;ng c&aacute;ch li&ecirc;n h&#7879; v&#7899;i ${AGENCY_NAME}.
    </p>

    <h2>7. Th&ocirc;ng tin li&ecirc;n h&#7879;</h2>
    <p>
      C&#417; quan ph&#7909; tr&aacute;ch: ${AGENCY_NAME}<br>
      &#272;&#7883;a ch&#7881;: ${AGENCY_ADDRESS}<br>
      &#272;i&#7879;n tho&#7841;i: ${AGENCY_PHONE}<br>
      C&#7893;ng d&#7883;ch v&#7909; c&ocirc;ng: <a href="${PUBLIC_SERVICE_PORTAL_URL}">${PUBLIC_SERVICE_PORTAL_URL}</a>
    </p>
  </main>
</body>
</html>`;
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
      privacyPolicy: "/privacy-policy",
    });
    return;
  }

  if (request.method === "GET" && requestUrl.pathname === "/privacy-policy") {
    logApi("privacy_policy");
    sendHtml(response, 200, renderPrivacyPolicyPage());
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
