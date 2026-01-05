import {store} from "../redux/configureStore";
import {ACT_DeleteUser} from "../redux/action-creators";
import {useSnackbar} from "./useSnackbar";
import {variantIcon} from "../context/SnackbarContext";

export const useErrorHandler = () => {
    let status: null | number | string = null;
    let message: string | null;
    const snackbar = useSnackbar();

    const setNotification = (stats: number | string, msg: string | null, snackBarVariant: keyof typeof variantIcon = 'success') => {
        if (stats) status = stats;
        if (msg) message = msg;

        if (!msg && stats) {
            switch (status) {
                case 200:
                    message = null;
                    break;

                case 204:
                    message = "داده‌ای یافت نشد";
                    break;

                case 400:
                    message = "خطا در داده های ارسال شده";
                    break;

                case 401:
                    message = "مجوز دسترسی ندارید";
                    window.location.href = '/logout';
                    break;

                case 403:
                    store.dispatch(ACT_DeleteUser());
                    message = "زمان نشست شما به اتمام رسید";
                    window.location.href = '/logout';
                    break;

                case 422:
                    store.dispatch(ACT_DeleteUser());
                    message = "زمان نشست شما به اتمام رسید";
                    window.location.href = '/logout';
                    break;

                case 404:
                    message = "خطا در دریافت اطلاعات";
                    break;

                case 409:
                    message = "داده تکراری است";
                    break;

                case 500:
                    message = "پاسخی از سمت سرور دریافت نشد";
                    break;

                case "failed":
                    message = "خطا در بر قراری ارتباط";
                    break;

                default:
                    message = "پیامی برای نمایش دریافت نشد";
                    break;
            }
        }

        if (stats && message) {
            snackbar(message, snackBarVariant);
        }
    };

    return {setNotification};
};
