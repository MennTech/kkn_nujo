import {
    Dropzone,
    FileMosaic,
    FullScreen,
    ImagePreview,
  } from "@files-ui/react";
  import * as React from "react";
  
  let selectedImages = null;
  const UploadImages = () => {
    const [file, setFile] = React.useState(null);
    const [imageSrc, setImageSrc] = React.useState(undefined);
  
    const updateFiles = (incomingFiles) => {
      setFile(incomingFiles[0]);
      console.log(incomingFiles[0]);
      selectedImages = incomingFiles[0];
    };
  
    const onDelete = () => {
      setFile(null);
    };
  
    const handleSee = (imageSource) => {
      setImageSrc(imageSource);
    };
  
    const handleAbort = () => {
      if (file) {
        setFile({ ...file, uploadStatus: "aborted" });
      }
    };
  
    const handleCancel = () => {
      if (file) {
        setFile({ ...file, uploadStatus: undefined });
      }
    };
  
    return (
      <>
        <Dropzone
          onChange={updateFiles}
          minHeight="195px"
          value={file ? [file] : []}
          accept="image/*"
          maxFiles={1}
          maxFileSize={1 * 1024 * 1024}
          label="Drag'n drop a file here or click to browse"
          fakeUpload
          actionButtons={{
            position: "after",
            abortButton: {},
          }}
        >
          {file && (
            <FileMosaic
              {...file}
              key={file.id}
              onDelete={onDelete}
              onSee={handleSee}
              onAbort={handleAbort}
              onCancel={handleCancel}
              resultOnTooltip
              alwaysActive
              preview
              info
            />
          )}
        </Dropzone>
        <FullScreen
          open={imageSrc !== undefined}
          onClose={() => setImageSrc(undefined)}
        >
          <ImagePreview src={imageSrc} />
        </FullScreen>
      </>
    );
  };
  
  export default UploadImages;
  export {selectedImages};