const express=require("express")
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")

const {isLoggedIn,validateReview,isAuthor}=require("../middleware.js")

const reviewController=require("../controllers/reviews.js")
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.create))

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.delete))

module.exports=router;