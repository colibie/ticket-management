export function validateEmail(email) {
  const validEmailRegex = 
  RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);

  return validEmailRegex.test(email);
}

export function validatePhone(phone) {
  const validPhoneRegex = RegExp(/^\+234\d{10}$/i);
  return validPhoneRegex.test(phone);
}