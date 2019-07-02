var express = require("express");

//Initializes App and Router
const router = express.Router();

//Includes Model
var { Graphic, Op } = require("../models/Graphic");

//Inclue dependencies
var multer = require("multer");
const fs = require("fs");

var path = require("path");

//store the file to server
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    let dir = __dirname + "../../uploads";

    // if (!fs.existsSync(dir)) {
    //   fs.mkdirSync(dir);
    // }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    if (file) {
      cb(null, file.fieldname + "-" + Date.now());
    }
  }
});

/**
 * Graphic Add
 */
router.post("/add", multer({ storage: storage }).single("image"), function(
  req,
  res
) {
  //Add graphic to Database
  Graphic.create({
    type: req.body.type,
    name: req.body.name,
    image: req.file.filename,
    caption: req.body.caption,
    link: req.body.link,
    link_text: req.body.link_text,
    created_at: req.body.created_at,
    updated_at: req.body.updated_at
  })
    .then(graphic => {
      //on success
      res.status(200).send({
        status: 1,
        id: graphic.id,
        message: "Graphic has been added successfully"
      });
    })
    .catch(error => res.status(400).send(error));
});

/**
 * Update Graphic
 */
router.put(
  "/update/:id",
  multer({ storage: storage }).single("image"),
  function(req, res) {
    // deleteOldImage(req.params.id, req.file.filename);

    Graphic.update(
      {
        type: req.body.type,
        name: req.body.name,
        image: req.file.filename,
        caption: req.body.caption,
        link: req.body.link,
        link_text: req.body.link_text
      },
      { where: { id: req.params.id } }
    )
      .then(() =>
        res.status(200).send({ message: "Graphic updated successfully!" })
      )
      .catch(error => res.status(400).send(error));
  }
);

/**
 * Delete Graphic
 */
router.delete("/delete/:id", function(req, res) {
  Graphic.destroy({ where: { id: req.params.id } })
    .then(() => {
      res.status(200).send({ message: "Graphic deleted successfully" });
    })
    .catch(error => res.status(400).send(error));
});

/**
 * Update Status
 */
router.get("/toggle/:id/:status", function(req, res) {
  var x = req.params.status == true ? 0 : 1;

  Graphic.update(
    {
      is_active: x
    },
    { where: { id: req.params.id } }
  )
    .then(() =>
      res.status(200).send({ message: "Status Updated successfully!" })
    )
    .catch(error => res.status(400).send(error));
});

/**
 * Graphic View
 */
router.get("/view/:id", function(req, res) {
  Graphic.findById(req.params.id, {
    attributes: [
      "id",
      "type",
      "name",
      "image",
      "caption",
      "is_active",
      "link",
      "link_text",
      "created_at"
    ]
  })
    .then(graphics => res.status(200).send(graphics))
    .catch(error => res.status(400).send(error));
});

/**
 * Graphics Summary
 */
router.get("/", function(req, res) {
  const { offset, limit, sort, order } = req.query;
  Graphic.count().then(count => {
    var totalPages = Math.ceil(parseFloat(count) / parseFloat(limit));
    if (typeof req.query.search === "undefined") {
      Graphic.findAll({
        attributes: [
          "id",
          "type",
          "name",
          "image",
          "caption",
          "is_active",
          "link",
          "link_text",
          "created_at"
        ],
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[sort, order]]
      })
        .then(graphics =>
          res.status(200).send({
            graphics: graphics,
            total: totalPages
          })
        )
        .catch(error => res.status(400).send(error));
    } else {
      Graphic.findAll({
        attributes: [
          "id",
          "type",
          "name",
          "image",
          "caption",
          "is_active",
          "link",
          "link_text",
          "created_at"
        ],
        where: { name: { [Op.like]: "%" + req.query.search + "%" } },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [[sort, order]]
      })
        .then(graphics =>
          res.status(200).send({
            graphics: graphics,
            total: totalPages
          })
        )
        .catch(error => res.status(400).send(error));
    }
  });
});

function deleteOldImage(id, newImage) {
  Graphic.findById(id, {
    attributes: ["id", "image"]
  }).then(graphic =>
    fs.unlink("./server/app/uploads/" + graphic.image, err => {
      if (err) throw err;
      console.log("successfully deleted");
    })
  );
}

module.exports = router;
