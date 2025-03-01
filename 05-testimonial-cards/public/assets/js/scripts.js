class DynamicSlides {
    static DATA_SLIDES = [
        {
            id: 1,
            title: "I am Pine",
            content: "This is dynamics slides testimonial cards projects I have done.",
            image: "slide-2.jpg",
        },
        {
            id: 2,
            title: "Wooden bridge",
            content: "A wooden bridge view to sea, that amazing!",
            image: "slide-1.jpg",
        },
        {
            id: 3,
            title: "Leg's someone",
            content: "Random pic capture a leg of someone on the road",
            image: "slide-3.jpg",
        },
        {
            id: 4,
            title: "Beautiful flower",
            content: "Perfect!",
            image: "slide-4.jpg",
        },
        {
            id: 5,
            title: "A nightfall",
            content: "Goodnight everyone! Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
            image: "slide-5.jpg",
        },
        {
            id: 6,
            title: "The mist",
            content:
                "So quiet! Voluptates nam earum magni molestiae tenetur placeat soluta cum illo reprehenderit perspiciatis similique eum, quia praesentium iure rem consequatur consequuntur? Voluptate, sit.",
            image: "slide-6.jpg",
        },
        {
            id: 7,
            title: "Beautiful flower",
            content: "Perfect!",
            image: "slide-7.jpg",
        },
        {
            id: 8,
            title: "A nightfall",
            content: "Goodnight everyone! Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
            image: "slide-8.jpg",
        },
        {
            id: 9,
            title: "The mist",
            content:
                "So quiet! Voluptates nam earum magni molestiae tenetur placeat soluta cum illo reprehenderit perspiciatis similique eum, quia praesentium iure rem consequatur consequuntur? Voluptate, sit.",
            image: "slide-9.jpg",
        },
    ];
    static SRC_FOLDER_SLIDE = "assets/images/slides";

    constructor() {
        this.initSlidesThumb();
    }

    createNodeSlideItem(slideItem, index) {
        let divEle = document.createElement("div");
        let imgEle = document.createElement("img");
        divEle.className = `slides__item ${index == 1 ? "slides__item--active" : "slides__item--thumb"}`;
        divEle.dataset.id = slideItem.id;
        imgEle.src = `${DynamicSlides.SRC_FOLDER_SLIDE}/${slideItem.image}`;
        divEle.appendChild(imgEle);

        if (index != 1) {
            divEle.addEventListener("click", (event) => {
                this.getContentSlide(slideItem.id);
                this.getResNavThumb_V2(slideItem.id);
            });
        }
        return divEle;
    }
    createNodeSlideContent(currentSlide, totalSlides) {
        const fragment = document.createDocumentFragment();
        let labelEle = document.createElement("label");
        let titleEle = document.createElement("h5");
        let contentEle = document.createElement("p");
        labelEle.appendChild(document.createTextNode(`#${currentSlide.id} / ${totalSlides}`));
        titleEle.appendChild(document.createTextNode(currentSlide.title));
        contentEle.appendChild(document.createTextNode(currentSlide.content));
        fragment.appendChild(labelEle);
        fragment.appendChild(titleEle);
        fragment.appendChild(contentEle);
        return fragment;
    }

    initSlidesThumb() {
        // const resNavThumb = DynamicSlides.DATA_SLIDES.slice(0, 6);

        // resNavThumb.forEach((slide, index) => {
        //     let nodeSlideItem = this.createNodeSlideItem(slide, index);
        //     slideThumbs.appendChild(nodeSlideItem);
        // });
        this.getResNavThumb_V2(1);
        this.getContentSlide(1);
    }

    getResNavThumb_V2(currentSlideID) {
        let totalSlides = DynamicSlides.DATA_SLIDES.length;
        let slidesData = DynamicSlides.DATA_SLIDES;
        let totalNextThumb = window.innerWidth > 480 ? 5 : 2;

        // console.log(window.innerWidth );

        let resSlideThumb = [];
        let startNo, endNo, firstSlide;

        let currentIndex = slidesData.findIndex((slide) => slide.id == currentSlideID);

        if (currentIndex == 0) {
            startNo = 0;
            endNo = totalNextThumb;

            firstSlide = slidesData.at(-1);

            resSlideThumb = slidesData.slice(startNo, endNo);
            resSlideThumb.unshift(firstSlide);
        } else {
            startNo = currentIndex;
            endNo = currentIndex + totalNextThumb;

            firstSlide = slidesData[currentIndex - 1];

            if (endNo > slidesData.length) {
                let tempArr = slidesData.slice(startNo, slidesData.length);
                let restTempArr = slidesData.slice(0, totalNextThumb - tempArr.length);

                // console.log(`Need: ${totalNextThumb - tempArr.length}`);

                resSlideThumb.push(firstSlide, ...tempArr, ...restTempArr);
            } else {
                resSlideThumb = slidesData.slice(startNo, endNo);
                resSlideThumb.unshift(firstSlide);
            }
        }
        // console.log(resSlideThumb);

        const slidesThumb = document.getElementById("slideThumbs-js");
        slidesThumb.innerHTML = "";
        resSlideThumb.forEach((slide, index) => {
            let nodeSlide = this.createNodeSlideItem(slide, index);
            slidesThumb.appendChild(nodeSlide);
        });
    }

    getContentSlide(slideID) {
        const slideContentEle = document.getElementById("slides__content-js");

        let currentSlide = DynamicSlides.DATA_SLIDES.find((slide) => slide.id == slideID);
        let totalSlides = DynamicSlides.DATA_SLIDES.length;
        let fragmentContent = this.createNodeSlideContent(currentSlide, totalSlides);

        slideContentEle.innerHTML = "";
        slideContentEle.appendChild(fragmentContent);
    }
}

const dynamicSlides = new DynamicSlides();
