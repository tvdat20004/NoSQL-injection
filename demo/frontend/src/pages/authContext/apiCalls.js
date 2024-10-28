import axios from 'axios';
import { loginFailure, loginSuccess, loginStart, logoutSuccess } from './AuthActions';
import Toastify from 'toastify-js';
import { useNavigate } from 'react-router-dom';



export const login = async (user, dispatch, navigate) => {
    dispatch(loginStart());

    try {
        const res = await axios.post(`http://localhost:8800/login`, user);
        dispatch(loginSuccess(res.data));

        Toastify({
            text: 'Đăng nhập thành công',
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center",
            },
        }).showToast();

        localStorage.setItem('user', JSON.stringify(res.data)); // Use `res` instead of `response`

        if (res.data.isAdmin) { // Use `res` here too
            navigate('/admin');
        } else {
            navigate('/user/testcase');
        }
    } catch (err) {
        Toastify({
            text: err.response.data,
            style: {
                background: "red",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            },
        }).showToast();
        dispatch(loginFailure());
    }
};

export const logout = async (dispatch) => {
    try {
        dispatch(logoutSuccess());
    } catch (err) {
        console.log(err);
    }
};
