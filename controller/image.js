const uploadImage = async (req, res) => {
  if (req.file) {
    const json = {
      result: "success",
      data: {
        imageURL: req.file.location,
      },
    };
    res.status(200).json(json);
  } else {
    const json = {
      result: "error",
    };
    res.status(200).json(json);
  }
};

const deleteImage = async (req, res) => {
  const { imageName } = req.body; // 객체 URL
  const imageArray = imageName.split("/");
  const imageKey = imageArray[3]; // Image Key
  const params = {
    Bucket: "movie-inner",
    Key: imageKey,
  };
  console.log(imageKey);
  try {
    await s3.deleteObject(params, function (err, data) {
      //존재하는 key가 없음
      if (err) {
        res.status(400);
        res.json({
          success: false,
          error: err,
        });
        //성공적으로 삭제
      } else {
        res.status(201);
        res.json({
          success: true,
          deleted: imageKey,
        });
      }
    });
    //추가 에러
  } catch (e) {
    console.error(e);
    res.status(400);
    res.json({
      success: false,
      error: e,
    });
  }
};

module.exports = { uploadImage, deleteImage };
