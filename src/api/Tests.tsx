import Axios from "@/config/Axios/index.js"


const Index = {
    questions: () => Axios.get('test/questions/').then(res => res),
    testSingle: (id: any) => Axios.get(`test/test/${id}`).then(res => res),
    testCreate: (data: any) => Axios.post('test/test/create/', data).then(res => res),
    personalityType: (code: string) => Axios.get(`test/personality-types/${code}/`).then(res => res),

    // refreshToken: (data:any) => Axios.get('auth/refresh /', { params: data }).then(res => res),
    // login: (data:any) => Axios.post('auth/login/', data).then(res => res),
    // contact: (data:any) => Axios.post('auth/contact/create/', data).then(res => res),
    // profile: () => Axios.get('auth/profile/').then(res => res),
    // about: () => Axios.get('auth/about-info/').then(res => res),
    // blog: () => Axios.get('auth/blogs/').then(res => res),
    // plans: () => Axios.get('auth/plans/').then(res => res),
    // blogSingle: (id:any) => Axios.get(`auth/blogs/${id}`).then(res => res),
    // contactInfo: () => Axios.get(`auth/contact-info/`).then(res => res),
    // custom: (url: string) => Axios.get(url).then(res => res),

}

export default Index;