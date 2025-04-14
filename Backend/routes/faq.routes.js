// import { Router } from "express";
// import faqModel from "../model/Schema/faq.schema.js";
// const router = Router();
// router.get("/", async (req, res) => {
//     const lang = req.query.lang;
//     if (!lang) {
//         return res.status(400).send("Please Provide Language")
//     }
//     const redisClient = req.redisClient;
//     const faqs = await faqModel.find();
//     console.log(faqs);
//     const result = await Promise.all(
//         faqs.map(async (faq) => {
//             // const question=faq.question;
//             // const answer=faq.answer;
//             if (lang != "en") {
//                 try {
//                     const translated_question = await faq.translateLang("question", lang, redisClient);
//                     const translated_answer = await faq.translateLang("answer", lang, redisClient);
//                     console.log(faq._id, translated_question, translated_answer);
//                     return {
//                         id: faq._id,
//                         question: translated_question,
//                         answer: translated_answer
//                     }
//                 }
//                 catch (err) {
//                     console.log(err);
//                 }
//             }
//             else {
//                 return {
//                     id: faq._id,
//                     question: faq.question,
//                     answer: faq.answer
//                 }
//             }
//         })

//     )
//     res.status(200).json({
//         faqs: result,
//         message: "FAQs Fetched Successfully"
//     })
// })
// router.post("/create", async (req, res) => {
//     const { question, answer } = req.body;
//     if (!question || !answer) {
//         return res.status(400).send("Please Provide Question and Answer")
//     }
//     const faq = new faqModel({
//         question,
//         answer
//     })
//     await faq.save();
//     res.status(201).json({
//         faq,
//         message: "FAQ Created Successfully"
//     })
// })
// export default router;
import { Router } from "express";
import { faq, allfaqs, voting } from "../controller/faq.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/adminaccess.middleware.js";

const router = Router();

router.post("/add", verifyJWT, isAdmin("admin"), faq);
router.get("/all", verifyJWT, allfaqs);
router.post("/vote/:id", verifyJWT, voting);

export default router;
