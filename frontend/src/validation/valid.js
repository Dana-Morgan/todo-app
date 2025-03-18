import * as Yup from 'yup';

export const validationSchema = Yup.object({
  name: Yup.string().when('isSignUp', {
    is: true,
    then: Yup.string().required('Name is required'),
  }),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  gender: Yup.string().when('isSignUp', {
    is: true,
    then: Yup.string().required('Gender is required'),
  }),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .when('isSignUp', {
      is: true,
      then: Yup.string().required('Confirm Password is required'),
    }),
});
