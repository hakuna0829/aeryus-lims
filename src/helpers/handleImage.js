import imageCompression from 'browser-image-compression';

export default async (event, setDisplayError, setImgState, setImgCompressionLoading, setDialogOpen) => {
  try {
    let files = event.target.files;
    if (files.length === 0)
      return;

    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      if (setDialogOpen)
        setDialogOpen(true);
      setDisplayError('Only images are supported.');
      return;
    } else {
      setDisplayError(null);
    }

    if ((files[0].size / 1024 / 1024) > 1) {
      // greater than 1 mb. compress file
      setImgCompressionLoading(true);
      console.log('compressing image...');

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/png',
      }
      const compressedBlob = await imageCompression(files[0], options);
      const compressedFile = new File([compressedBlob], files[0].name, { lastModified: new Date().getTime(), type: compressedBlob.type });

      let reader = new FileReader();
      setImgState(imgState => ({
        ...imgState,
        imagePath: compressedFile
      }));

      reader.readAsDataURL(compressedFile);
      reader.onload = (_event) => {
        setImgState(imgState => ({
          ...imgState,
          imgURL: reader.result
        }));
      }
      setImgCompressionLoading(false);
    } else {
      // less than 1 mb. save file
      let reader = new FileReader();
      setImgState(imgState => ({
        ...imgState,
        imagePath: files[0]
      }));
      reader.readAsDataURL(files[0]);
      reader.onload = (_event) => {
        setImgState(imgState => ({
          ...imgState,
          imgURL: reader.result
        }));
      }
    }
  } catch (error) {
    console.log(error);
    if (setDialogOpen)
      setDialogOpen(true);
    setDisplayError(error.message || JSON.stringify(error));
  }
}