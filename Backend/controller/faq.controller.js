import faqModel from "../model/Schema/faq.schema.js";
const getALLFAQs=async(lang)=>{
    const faqs=await faqModel.find();
    if(lang=="en"){
        return faqs;
    }
    else{
        
    }
}