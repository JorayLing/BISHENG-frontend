import { useNavigate,useLocation } from 'react-router-dom';
// import Cookies from 'js-cookie';

function Jump() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const access_token_cookie = searchParams.get('access_token_cookie');
    console.log(access_token_cookie);
    // Cookies.set('access_token_cookie', access_token_cookie);

    var date = new Date();
    date.setTime(date.getTime() + (2 * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toUTCString();
    document.cookie = "access_token_cookie" + "=" + (access_token_cookie || "") + expires + "; path=/";

    const url = searchParams.get('url');
    console.log(url);

    const navigate = useNavigate();
    navigate(url);


    return (
        <svg width="18px" height="34.4px" viewBox="0 0 18 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <title>编组 34</title>
            <desc>Created with Sketch.</desc>
            <g id="平台" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g id="编组-34" transform="translate(-0.000000, 0.000000)" fill="#000000">
                    <path 
                        d="M1.02510513,21.8725056 C0.994504973,21.8646536 0.965254826,21.8540303 0.935104676,21.8438689 C0.964804824,21.8535684 0.994504973,21.8646536 1.02510513,21.8725056 L1.02510513,21.8725056 Z M10.3077515,11.5046008 C10.2785014,11.4953631 10.2506013,11.4847398 10.2213511,11.4768878 C10.2506013,11.4847398 10.2785014,11.4949012 10.3077515,11.5046008 L10.3077515,11.5046008 Z M0.664653323,21.7274741 L4.5000225,23.9999423 L4.5000225,13.2897815 L6.75003375,14.6306301 L6.75003375,22.6664838 L11.2500563,20.0000289 L11.2500563,17.3114035 L11.2500563,12.8186601 C11.2500563,12.2856462 10.9530548,11.8283813 10.5228526,11.5965157 C10.5386027,11.6052915 10.5566028,11.6085246 10.5714529,11.6173004 L4.5000225,7.99982679 L4.5000225,3.46274258 C4.5000225,2.98469288 4.26422132,2.56345489 3.90556953,2.31403766 L3.89836949,2.3098807 L5.32907052e-15,1.93622895e-13 L5.32907052e-15,20.527962 L5.32907052e-15,20.5353522 C0.00135000675,21.0642091 0.294301472,21.5177789 0.719553598,21.7501064 C0.702903515,21.7408688 0.683103416,21.7371737 0.666903335,21.7274741 L0.664653323,21.7274741 Z" 
                        id="Fill-8">
                        <animateTransform 
                            attributeName="transform" 
                            type="translate" 
                            values="0 0; 0 -1.2; 0 0" 
                            dur="0.8s" 
                            begin="0s" 
                            repeatCount="indefinite" />
                    </path>
                    <path 
                        d="M14.5286826,10.1247231 C14.4976325,10.1325751 14.4679323,10.1436603 14.4382322,10.1533598 C14.4683823,10.1436603 14.4976325,10.1325751 14.5286826,10.1247231 L14.5286826,10.1247231 Z M14.1749809,10.2665214 C14.191181,10.2563599 14.2109811,10.2526649 14.2276311,10.2434272 C13.796979,10.4752928 13.4999775,10.9330196 13.4999775,11.4664954 L13.4999775,21.3332564 L5.16773584,26.2707938 L5.19068595,26.2643274 C4.78793394,26.4975787 4.51028255,26.9322113 4.4999325,27.4384359 L4.4999325,27.498019 L4.4999325,30.1053528 C4.4994825,30.1155142 4.49678248,30.1247519 4.49678248,30.1349134 C4.49678248,30.1450748 4.4994825,30.1543125 4.4999325,30.1644739 L4.4999325,32 L13.4999775,26.6666282 L17.3240966,24.4006264 L17.2979965,24.4075547 C17.7142486,24.1715321 18,23.7216573 18,23.1992668 L18,18.6668014 L18,7.99959585 L14.1749809,10.2665214 Z" 
                        id="Fill-12">
                        <animateTransform 
                            attributeName="transform" 
                            type="translate" 
                            values="0 0; 0 1.2; 0 0" 
                            dur="0.8s" 
                            begin="0s" 
                            repeatCount="indefinite" />
                    </path>
                </g>
            </g>
        </svg>
    )
}

export default Jump;

