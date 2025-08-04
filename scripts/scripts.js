document.addEventListener("DOMContentLoaded", () => {
    const membersEls = {
        container: document.querySelector(".members__container"),
        list: document.querySelector(".members__list"),
        items: document.querySelectorAll(".members__list-item"),
        vicCounter: document.querySelector(".members__controls-counter_vic"),
        totalCounter: document.querySelector(".members__controls-counter span:last-child"), // /6
        controls: document.querySelector(".members__controls"),
        prevBtn: document.querySelector(".members__controls-btn_prev"),
        nextBtn: document.querySelector(".members__controls-btn_next")
    };

    let membersState = {
        index: 0,
        vic: 1,
        gap: 20,
        itemW: 0,
        totalSlides: 0,
        totalItems: membersEls.items.length,
        offset: 0,
        autoplayTimer: null,
        autoplay: true
    };

    const updateMembersConfig = () => {
        membersState.itemW = membersEls.items[0].offsetWidth;
        membersState.gap = window.matchMedia("(max-width: 375px)").matches ? 32 : 20;
        membersState.vic = Math.floor((membersEls.container.clientWidth + membersState.gap) / (membersState.itemW + membersState.gap));
        if (membersState.vic < 1) membersState.vic = 1;
        membersState.totalSlides = Math.ceil(membersState.totalItems / membersState.vic);
        membersState.offset = -(membersState.itemW + membersState.gap) * membersState.index * membersState.vic;

        // обновляем счётчики
        membersEls.vicCounter.textContent = Math.min((membersState.index + 1) * membersState.vic, membersState.totalItems);
        membersEls.totalCounter.textContent = membersState.totalItems;

        membersEls.list.style.transform = `translateX(${membersState.offset}px)`;
    };

    const moveMembers = (dir) => {
        membersState.index += dir;
        if (membersState.index < 0) membersState.index = membersState.totalSlides - 1;
        if (membersState.index >= membersState.totalSlides) membersState.index = 0;
        membersState.offset = -(membersState.itemW + membersState.gap) * membersState.index * membersState.vic;

        // обновляем счётчики
        membersEls.vicCounter.textContent = Math.min((membersState.index + 1) * membersState.vic, membersState.totalItems);

        membersEls.list.style.transition = "transform 0.5s ease";
        membersEls.list.style.transform = `translateX(${membersState.offset}px)`;
    };


    const startAutoplay = () => {
        if (!membersState.autoplay) return;
        stopAutoplay();
        membersState.autoplayTimer = setInterval(() => moveMembers(1), 4000);
        membersEls.controls.classList.add("members__controls--running");
        membersEls.controls.classList.remove("members__controls--paused");
    };

    const stopAutoplay = () => {
        clearInterval(membersState.autoplayTimer);
        membersEls.controls.classList.add("members__controls--paused");
        membersEls.controls.classList.remove("members__controls--running");
    };

    membersEls.prevBtn.addEventListener("click", () => moveMembers(-1));
    membersEls.nextBtn.addEventListener("click", () => moveMembers(1));
    membersEls.controls.addEventListener("mouseenter", stopAutoplay);
    membersEls.controls.addEventListener("mouseleave", startAutoplay);

    window.addEventListener("resize", () => {
        membersEls.list.style.transition = "none";
        updateMembersConfig();
    });

    updateMembersConfig();
    startAutoplay();

    const stagesEls = {
        container: document.querySelector(".stages__list-container"),
        list: document.querySelector(".stages__list"),
        dots: document.querySelectorAll(".stages__carousel-dot"),
        prevBtn: document.querySelector(".stages__carousel-btn_prev"),
        nextBtn: document.querySelector(".stages__carousel-btn_next")
    };

    let stagesState = {
        index: 0,
        containerW: 0,
        totalSlides: 5
    };

    const updateStagesState = () => {
        stagesState.containerW = stagesEls.container.clientWidth;
        stagesEls.list.style.setProperty("--translate-x", `${-(stagesState.containerW + 20) * stagesState.index}px`);
        stagesEls.list.style.transition = "transform 0.4s ease";
        stagesEls.prevBtn.disabled = stagesState.index === 0;
        stagesEls.nextBtn.disabled = stagesState.index === stagesState.totalSlides - 1;
        stagesEls.dots.forEach(dot => dot.removeAttribute("data-current"));
        stagesEls.dots[stagesState.index].setAttribute("data-current", "true");
    };

    const moveStages = (dir, index = null) => {
        if (index !== null) {
            stagesState.index = index;
        } else {
            stagesState.index += dir;
        }
        if (stagesState.index < 0) stagesState.index = 0;
        if (stagesState.index >= stagesState.totalSlides) stagesState.index = stagesState.totalSlides - 1;
        updateStagesState();
    };

    stagesEls.prevBtn.addEventListener("click", () => moveStages(-1));
    stagesEls.nextBtn.addEventListener("click", () => moveStages(1));
    stagesEls.dots.forEach((dot, idx) => {
        dot.addEventListener("click", () => moveStages(null, idx));
    });

    window.addEventListener("resize", updateStagesState);
    updateStagesState();

});
