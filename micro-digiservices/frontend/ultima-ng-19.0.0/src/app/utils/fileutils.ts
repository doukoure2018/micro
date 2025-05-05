export const server = 'http://localhost:8000';

export const authorizationServer = 'http://localhost:8080';

export const getFormData = (formValue: any, files?: File[]): FormData => {
    const formData = new FormData();
    for (const property in formValue) {
        formData.append(property, formValue[property]);
    }

    if (files && files.length > 0) {
        files.forEach((file) => formData.append('files', file, file.name));
    }

    return formData;
};
