export function processResponse(response) {
   return new Promise(function (resolve, reject) {
      if (response.status === 200) {
         if (response.data instanceof Blob) {
            resolve(response)
         } else {
            if (response.data.code === 200) {
               resolve(response)
            } else if (response.data.code === 400) {
               reject(response.data.message);
            } else if (response.data.code === 440) {
               Promise.all([localStorage.removeItem('userData')]).then(() => {
                  window.location.href = '/#/login'
               })
               reject(response.data.message);
            } else {
               reject(response.data.message);
            }
         }
      } else if (response.status === 422) {
         reject('Unprocessable Entity')
      } else {
         reject('Error')
      }
   });
}
