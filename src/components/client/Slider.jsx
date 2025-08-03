import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import shape1 from '../../assets/images/slider/shape1.png';
import slider1 from '../../assets/images/slider/slider1.png';
import slider1Man2 from '../../assets/images/slider/slider1-man2.png';

export default function Slider() {
    return (
        <section className="hero-slider-area position-relative">
            <Swiper
                className="hero-slider-container"
                modules={[Pagination, Autoplay]}
                slidesPerView={1}
                slidesPerGroup={1}
                spaceBetween={0}
                loop={true}
                speed={700}
                effect="fade"
                fadeEffect={{
                    crossFade: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    el: '.hero-slider-pagination',
                    clickable: true,
                }}
            >
                <SwiperSlide>
                    <div className="hero-slide-item">
                        <div className="container">
                            <div className="row align-items-center position-relative">
                                <div className="col-12 col-sm-6">
                                    <div className="hero-slide-content">
                                        <div className="hero-slide-shape-img">
                                            <img src={shape1} width="180" height="180" alt="Image" />
                                        </div>
                                        <h4 className="hero-slide-sub-title">HURRY UP!</h4>
                                        <h1 className="hero-slide-title">Let's find your fashion outfit.</h1>
                                        <p className="hero-slide-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.</p>
                                        <div className="hero-slide-meta">
                                            <a className="btn btn-border-primary" href="shop.html">Shop Now</a>
                                            <a className="ht-popup-video" data-fancybox data-type="iframe" href="https://player.vimeo.com/video/172601404?autoplay=1">
                                                <i className="fa fa-play icon"></i>
                                                <span>Play Now</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <div className="hero-slide-thumb">
                                        <img src={slider1} width="555" height="550" alt="Image" />
                                    </div>
                                </div>
                            </div>
                            <div className="hero-social">
                                <a href="https://www.facebook.com/" target="_blank" rel="noopener">fb</a>
                                <a href="https://www.twitter.com/" target="_blank" rel="noopener">tw</a>
                                <a href="https://www.linkedin.com/" target="_blank" rel="noopener">in</a>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                
                <SwiperSlide>
                    <div className="hero-slide-item">
                        <div className="container">
                            <div className="row align-items-center position-relative">
                                <div className="col-12 col-sm-6">
                                    <div className="hero-slide-content">
                                        <div className="hero-slide-shape-img">
                                            <img src={shape1} width="180" height="180" alt="Image" />
                                        </div>
                                        <h4 className="hero-slide-sub-title">HURRY UP!</h4>
                                        <h2 className="hero-slide-title">Let's find your fashion outfit.</h2>
                                        <p className="hero-slide-desc">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.</p>
                                        <div className="hero-slide-meta">
                                            <a className="btn btn-border-primary" href="shop.html">Shop Now</a>
                                            <a className="ht-popup-video" data-fancybox data-type="iframe" href="https://player.vimeo.com/video/172601404?autoplay=1">
                                                <i className="fa fa-play icon"></i>
                                                <span>Play Now</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-sm-6">
                                    <div className="hero-slide-thumb">
                                        <img src={slider1Man2} width="555" height="550" alt="Image" />
                                    </div>
                                </div>
                            </div>
                            <div className="hero-social">
                                <a href="https://www.facebook.com/" target="_blank" rel="noopener">fb</a>
                                <a href="https://www.twitter.com/" target="_blank" rel="noopener">tw</a>
                                <a href="https://www.linkedin.com/" target="_blank" rel="noopener">in</a>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                {/* Add Pagination */}
                <div className="hero-slider-pagination"></div>
            </Swiper>
        </section>
    );
}
