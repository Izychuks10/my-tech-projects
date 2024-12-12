class CookieeInit {
    static COOKIE_NAME = "CookieBy=IamPine1611";
    static CLASSLIST = { hideConsentBox: "cookiee--hide", hideMessage: "cookiee__message-wrap--hide" };
    static MAX_AGE = 60 * 60 * 24;
    static IDLE_FOR_CONSENT = 60 * 60 * 1000;

    constructor(acceptBtn, rejectBtn, consentBox) {
        this.consentBox = consentBox ? consentBox : document.getElementById("consentBox");
        this.acceptBtn = acceptBtn ? acceptBtn : document.getElementById("acceptCookie");
        this.rejectBtn = rejectBtn ? rejectBtn : document.getElementById("rejectCookie");

        this.initCookiee();
    }

    initCookiee() {
        let checkCookie = document.cookie.indexOf(CookieeInit.COOKIE_NAME);
        if (checkCookie !== -1) {
            this.consentBox.classList.add(CookieeInit.CLASSLIST.hideConsentBox);
        } else {
            this.consentBox.classList.remove(CookieeInit.CLASSLIST.hideConsentBox);
            this.acceptCookie(this.acceptBtn);
            this.rejectCookie(this.rejectBtn);
        }
    }

    acceptCookie(acceptBtn) {
        acceptBtn.addEventListener("click", (event) => {
            document.cookie = `CookieBy=IamPine1611; Max-Age=${CookieeInit.MAX_AGE}; SameSite=Lax; Secure`;
            if (document.cookie) {
                this.consentBox.classList.add(CookieeInit.CLASSLIST.hideConsentBox);
            } else {
                let messageBox = document.getElementById("messageBox");
                let contentMessage = document.querySelector(".cookiee__message");
                let time = 0;
                let timeout = setInterval(() => {
                    time++;
                    contentMessage.innerHTML = "Cookie can't be set!";
                    messageBox.classList.remove(CookieeInit.CLASSLIST.hideMessage);
                    if (time == 30) {
                        messageBox.classList.add(CookieeInit.CLASSLIST.hideMessage);
                        clearInterval(timeout);
                    }
                }, 30);
            }
        });
    }

    rejectCookie(rejectBtn) {
        rejectBtn.addEventListener("click", (event) => {
            let messageBox = document.getElementById("messageBox");
            let contentMessage = document.querySelector(".cookiee__message");
            let time = 0;
            let timeout = setInterval(() => {
                time++;
                contentMessage.innerHTML = "Cookie rejected.";
                messageBox.classList.remove(CookieeInit.CLASSLIST.hideMessage);
                if (time == 30) {
                    messageBox.classList.add(CookieeInit.CLASSLIST.hideMessage);
                    clearInterval(timeout);
                }
            }, 30);
            this.consentBox.classList.add(CookieeInit.CLASSLIST.hideConsentBox);

            // idle for showup consent again - for the first time think will use interval
            // but now, I think use settimeout also is good idea
            setTimeout(() => {
                this.consentBox.classList.remove(CookieeInit.CLASSLIST.hideConsentBox);
            }, CookieeInit.IDLE_FOR_CONSENT);
        });
    }

    // idleConsentBox(time) {
    //     let idleConsent = setInterval(() => {
    //         time++;
    //         console.log(time);
    //         if (time == 100) {
    //             this.consentBox.classList.remove(CookieeInit.CLASSLIST.hideConsentBox);
    //             clearInterval(idleConsent);
    //         }
    //     }, 100);
    // }
}

const consentBox = document.getElementById("consentBox");
const acceptBtn = document.getElementById("acceptCookie");
const rejectBtn = document.getElementById("rejectCookie");

const cookieeInit = new CookieeInit();
