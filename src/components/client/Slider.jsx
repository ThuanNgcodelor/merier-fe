import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import shape1 from '../../assets/images/slider/shape1.png';

// Cat images
import slider1 from '../../assets/images/slider/slider1.jpg';
import slider2 from '../../assets/images/slider/slider2.jpg';
import slider3 from '../../assets/images/slider/slider3.jpg';
import slider4 from '../../assets/images/slider/slider4.jpg';
import slider5 from '../../assets/images/slider/slider5.jpg';

// Dog images
import slider6 from '../../assets/images/slider/slider6.jpg';
import slider7 from '../../assets/images/slider/slider7.jpg';
import slider8 from '../../assets/images/slider/slider8.jpg';
import slider9 from '../../assets/images/slider/slider9.jpg';
import slider10 from '../../assets/images/slider/slider10.jpg';

// Banner images
import banner1 from '../../assets/images/shop/banner/01.png';
import banner2 from '../../assets/images/shop/banner/02.png';
import banner3 from '../../assets/images/shop/banner/03.png';

export default function Slider() {
  return (
    <>
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
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ el: '.hero-slider-pagination', clickable: true }}
        >
          {/* ===== CAT SLIDES ===== */}
          <SwiperSlide>
            <SlideContent
              title="Healthy Meals for Cats"
              subtitle="CAT CARE"
              desc="Balanced nutrition crafted by vets to keep your cat healthy."
              link="/shop"
              img={slider1}
              isFirst={true}
            />
          </SwiperSlide>

          <SwiperSlide>
            <SlideContent
              title="Regular Health Exams"
              subtitle="CHECKUPS"
              desc="Preventive vet visits ensure your cat lives a long, happy life."
              link="/vets"
              img={slider2}
            />
          </SwiperSlide>

          <SwiperSlide>
            <SlideContent
              title="Professional Cat Grooming"
              subtitle="GROOMING"
              desc="Keep your cat's coat shiny and clean with expert grooming."
              link="/services"
              img={slider3}
            />
          </SwiperSlide>

          <SwiperSlide>
            <SlideContent
              title="Vaccination & Protection"
              subtitle="WELLNESS"
              desc="Protect your cat from diseases with timely vaccines."
              link="/appointments"
              img={slider4}
            />
          </SwiperSlide>

          <SwiperSlide>
            <SlideContent
              title="Toys & Accessories"
              subtitle="PLAY & FUN"
              desc="Explore a variety of toys to keep your cat active and happy."
              link="/shop"
              img={slider5}
            />
          </SwiperSlide>

          {/* ===== DOG SLIDES ===== */}
          <SwiperSlide>
            <SlideContent
              title="Nutritious Meals for Dogs"
              subtitle="DOG CARE"
              desc="High-quality dog food for strength and vitality."
              link="/shop"
              img={slider6}
            />
          </SwiperSlide>

          <SwiperSlide>
            <SlideContent
              title="Routine Vet Checkups"
              subtitle="HEALTH"
              desc="Keep your dog healthy with regular veterinary checkups."
              link="/vets"
              img={slider7}
            />
          </SwiperSlide>

          <SwiperSlide>
            <SlideContent
              title="Dog Grooming & Bath"
              subtitle="GROOMING"
              desc="Pamper your dog with professional grooming and spa."
              link="/services"
              img={slider8}
            />
          </SwiperSlide>

          <SwiperSlide>
            <SlideContent
              title="Vaccination & Prevention"
              subtitle="WELLNESS"
              desc="Protect your dog from diseases with timely vaccination."
              link="/appointments"
              img={slider9}
            />
          </SwiperSlide>

          <SwiperSlide>
            <SlideContent
              title="Toys & Outdoor Fun"
              subtitle="FUN & PLAY"
              desc="Discover toys and accessories to keep your dog active."
              link="/shop"
              img={slider10}
            />
          </SwiperSlide>

          {/* Pagination */}
          <div className="hero-slider-pagination"></div>
        </Swiper>
      </section>

      {/* Product Banner Area */}
      <section className="product-banner-area section-top-space">
        <div className="container">
          <Swiper className="banner-slider-container" modules={[Autoplay]} slidesPerView={3} spaceBetween={30} breakpoints={{
            1200: { slidesPerView: 3 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            320: { slidesPerView: 2, spaceBetween: 15 },
            0: { slidesPerView: 1 }
          }}>
            <SwiperSlide>
              <a href="/shop" className="product-banner-item">
                <img className="icon" src={banner1} width="370" height="294" alt="Image-HasTech" />
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="/shop" className="product-banner-item">
                <img className="icon" src={banner2} width="370" height="294" alt="Image-HasTech" />
              </a>
            </SwiperSlide>
            <SwiperSlide>
              <a href="/shop" className="product-banner-item">
                <img className="icon" src={banner3} width="370" height="294" alt="Image-HasTech" />
              </a>
            </SwiperSlide>
          </Swiper>
        </div>
        <h6 className="visually-hidden">Banner Section</h6>
      </section>
    </>
  );
}

/* Reusable slide content component */
function SlideContent({ title, subtitle, desc, link, img, isFirst = false }) {
  return (
    <div className="hero-slide-item">
      <div className="container">
        <div className="row align-items-center position-relative">
          <div className="col-12 col-sm-6">
            <div className="hero-slide-content">
              <div className="hero-slide-shape-img">
                <img src={shape1} width="180" height="180" alt="Shape" />
              </div>
              <h4 className="hero-slide-sub-title">{subtitle}</h4>
              {isFirst ? (
                <h1 className="hero-slide-title">{title}</h1>
              ) : (
                <h2 className="hero-slide-title">{title}</h2>
              )}
              <p className="hero-slide-desc">{desc}</p>
              <div className="hero-slide-meta">
                <a className="btn btn-border-primary" href={link}>Shop Now</a>
                <a className="ht-popup-video" data-fancybox data-type="iframe" href="https://player.vimeo.com/video/172601404?autoplay=1">
                  <i className="fa fa-play icon"></i>
                  <span>Play Now</span>
                </a>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6">
            <div className="hero-slide-thumb">
              <img
                src={img}
                width="555"
                height="550"
                alt={title}
                style={{
                  borderRadius: "20px",
                  objectFit: "cover"
                }}
              />
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
  );
}
