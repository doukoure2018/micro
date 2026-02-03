// src/app/utils/fileutils.ts
var getFormData = (formValue, files) => {
  const formData = new FormData();
  for (const property in formValue) {
    formData.append(property, formValue[property]);
  }
  if (files && files.length > 0) {
    files.forEach((file) => formData.append("files", file, file.name));
  }
  return formData;
};

export {
  getFormData
};
//# sourceMappingURL=chunk-4JF3UP6R.js.map
