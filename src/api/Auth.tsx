import Axios from "@/config/Axios/index.js"


const Index = {
    refreshToken: (data: any) => Axios.post('auth/refresh/', data).then(res => res),
    login: (data: any) => Axios.post('auth/login/', data).then(res => res),
    register: (data: any) => Axios.post('auth/register/', data).then(res => res),
    verifyEmail: (data: any) => Axios.post('auth/verify-email/', data).then(res => res),
    resendCode: (data: any) => Axios.post('auth/resend-code/', data).then(res => res),
    contact: (data: any) => Axios.post('auth/contact/create/', data).then(res => res),
    profile: () => Axios.get('auth/profile/').then(res => res),
    profileUpdate: (data: any) => Axios.put('auth/user/update/', data).then(res => res),
    profilePPUpdate: (data: any) =>
        Axios.put('auth/user/update/pp/', data, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res),
    profilePasswordUpdate: (data: any) => Axios.put('auth/change/password/', data).then(res => res),
    about: () => Axios.get('auth/about-info/').then(res => res),
    blog: () => Axios.get('auth/blogs/').then(res => res),
    plans: () => Axios.get('auth/plans/').then(res => res),
    blogSingle: (id: any) => Axios.get(`auth/blogs/${id}`).then(res => res),
    contactInfo: () => Axios.get(`auth/contact-info/`).then(res => res),
    custom: (url: string) => Axios.get(url).then(res => res),
    buyplan: (data: any) => Axios.post('pay/buy-plan/', data).then(res => res),
    buysuccess: (params: any) => Axios.get('pay/paypal/success/', params).then(res => res),
    getInvoices: () => Axios.get('pay/my-payments/').then(res => res),
    socialLinks: () => Axios.get('auth/social-links/').then(res => res),
    forgotPassword: (data: any) => Axios.post('auth/forgot-password/', data).then(res => res),
    resetPassword: (data: any) => Axios.post('auth/reset-password/', data).then(res => res),
    myPayments: () => Axios.get('pay/my-payments/').then(res => res),
}

export default Index;

