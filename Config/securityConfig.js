// import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
// import csrf from 'csurf';
import cookieParser from 'cookie-parser';

// Rate limiting: giới hạn số lượng request từ 1 IP trong 15 phút
// export const rateLimiter = rateLimit({
//    windowMs: 15 * 60 * 1000, // 15 phút
//    max: 100, 
//    message: "Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 15 phút."
// });

export const securityHeaders = helmet();

export const corsConfig = cors({
   origin: '*',  // Cho phép tất cả các nguồn
   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Các phương thức cho phép
   allowedHeaders: ['Content-Type', 'Authorization', 'CSRF-Token'], // Các header cho phép
   optionsSuccessStatus: 200 // Để hỗ trợ một số trình duyệt cũ
});

// CSRF protection: bảo vệ chống lại CSRF tấn công
// export const csrfProtection = csrf({ cookie: true });

// Cookie parser: cần thiết để xử lý cookie cho CSRF
export const parseCookies = cookieParser();
