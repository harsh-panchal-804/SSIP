import faqModel from "../model/Schema/faq.schema";
import { ApiError } from "../utils/ApiError";
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const faq = asyncHandler(async(req,res)=>{
    if(!req.user || req.user.role!= admin){
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

const voting = asyncHandler(async(req,res)=>{

    const{id} = req.params;
    const{ voteType} = req.body;

    if(![upvotes,downvotes].includes(voteType)){
        throw new ApiError(400,"Wrong vote type choosen")
    }
    const faqq= await faqModel.findById(id);
    if(!faqq){
       throw new ApiError(404,"no Faq with this id exists");
    }
    if(voteType=="upvotes") faqq.upvotes+=1;
    else if(voteType="downvotes") faqq.downvotes+=1;

    await faqq.save({validateBeforeSave:false});

    res.status(200).
    json(new ApiResponse(200,faqq,"Vote Updated successfully"))
})

export{
    faq,
    allfaqs,
    voting
}
