const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, validateListing, wrapAsync(listingController.create));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("./listings/new.ejs");
  });

router.route("/:id")
.get(wrapAsync(listingController.show))
.put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.update)
  )
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.delete));

//Index Route
// router.get("/",wrapAsync(listingController.index))

//Show Route
// router.get("/:id", wrapAsync(listingController.show));

//Create Route
// router.post("/",validateListing,wrapAsync(listingController.create));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

router.put(
  "/listings/:id",
  validateListing,
  wrapAsync(listingController.edit2)
);

//Update Route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.update)
// );

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));

module.exports = router;
