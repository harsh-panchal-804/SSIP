import faqSchema from "../model/Schema/faq.schema";
import { ApiError } from "../utils/ApiError";
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const faq = asyncHandler(async(req,res)=>{
    if(req.user.role!= admin){
        throw new ApiError(403,"you do not have permission to add FAQs");
    }
    const{question,answer}= req.body;

    if(
        [question , answer].some((Field)=>Field.trim()==="")
    ){
        throw new ApiError(400,"Put questions and answers both in the field");
    }
    const faqs= await  faqModel.Create({question,answer});
    
    res.satus(200).
    json(new ApiResponse (200,faqs,"FAQ added"));
})


const allfaqs= asyncHandler(async(req,res)=>{

    const faqss = await faqModel.find();
    res.satus(200).
    json(new ApiResponse (200,faqss,"All FAQs "));
})


export{
    faq,
    allfaqs
}