import type { Metadata } from "next";
import Link from "next/link";
import { IdeaMediaScroll } from "@/components/projects/IdeaMediaScroll";
const description =
  "IDEA (2024) — branding and exhibition work by TAAM Works, an interdisciplinary studio based in London.";

export const metadata: Metadata = {
  title: "IDEA — Branding & Exhibition",
  description,
  alternates: { canonical: "/works/idea" },
  openGraph: {
    type: "article",
    title: "IDEA — Branding & Exhibition · TAAM Works",
    description,
    images: [{ url: "/work/idea-card.png", width: 434, height: 455 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "IDEA — Branding & Exhibition · TAAM Works",
    description,
    images: ["/work/idea-card.png"],
  },
};

export default function IdeaProjectPage() {
  return (
    <>
      <div className="idea-content">
        <IdeaMediaScroll>
          <img
            className="idea-media-photo"
            src="/work/idea-photo.png"
            alt="IDEA"
            width={719}
            height={466}
            fetchPriority="high"
          />
          <video
            className="idea-media-video"
            src="/work/idea.mp4"
            width={718}
            height={928}
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noplaybackrate"
          />
          <div className="idea-media-pair">
            <img
              className="idea-media-pair-left"
              src="/work/idea-pair-left.jpg"
              alt="IDEA workshops"
              width={359}
              height={479}
              loading="lazy"
              decoding="async"
            />
            <img
              className="idea-media-pair-right"
              src="/work/idea-pair-right.jpg"
              alt="IDEA poster"
              width={360}
              height={479}
              loading="lazy"
              decoding="async"
            />
          </div>
          <img
            className="idea-media-logo"
            src="/work/idea-logo.png"
            alt="IDEA"
            width={719}
            height={465}
            loading="lazy"
            decoding="async"
          />
          <img
            className="idea-media-shirts"
            src="/work/idea-shirts.jpg"
            alt="IDEA shirts"
            width={719}
            height={405}
            loading="lazy"
            decoding="async"
          />
          <video
            className="idea-media-main"
            src="/work/idea-main.mp4"
            width={720}
            height={900}
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload nofullscreen noplaybackrate"
          />
          <img
            className="idea-media-posters"
            src="/work/idea-posters.jpg"
            alt="IDEA posters"
            width={719}
            height={463}
            loading="lazy"
            decoding="async"
          />
          <div className="idea-media-end">
            <img
              className="idea-media-badge"
              src="/work/idea-badge.jpg"
              alt="IDEA media badge"
              width={365}
              height={456}
              loading="lazy"
              decoding="async"
            />
            <video
              className="idea-media-loop"
              src="/work/idea-poster-loop.mp4"
              width={353}
              height={456}
              loop
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noplaybackrate"
            />
          </div>
        </IdeaMediaScroll>
        <div className="idea-copy">
          <h1 className="idea-title">
            <span className="idea-title-en">IDEA </span>
            <span className="idea-title-ar" lang="ar">ايديـــا</span>
            <span className="idea-leader" aria-hidden="true">
              {"-----------------------------------------------------------"}
            </span>
            <span className="idea-year">{"\u201824"}</span>
          </h1>
          <p className="idea-copy-en">
            an interdisciplinary studio based in London, working across
            design, technology, experiences, and spaces. We bring together
            diverse disciplines to create purposeful identities, products,
            environments, and experiences that bring ideas to life across
            physical and digital experiences.
          </p>
          <p className="idea-copy-ar" lang="ar" dir="rtl">
            استوديو متعدد التخصصات يتخذ من لندن مقراً له، ويعمل في مجالات
            التصميم والتكنولوجيا وتصميم التجارب والمساحات. نحن نجمع بين
            تخصصات متنوعة لابتكار هويات ومنتجات وبيئات وتجارب هادفة تضفي
            الحياة على الأفكار، سواء في العالم المادي أو الرقمي.
          </p>
          <p className="idea-tags">BRANDING, EXHIBITION</p>
        </div>
      </div>
      <div className="idea-stage" />
      <Link href="/works/events-program" className="idea-next">
        <span>NEXT PROJECT</span>
        <svg
          className="idea-next-arrow"
          xmlns="http://www.w3.org/2000/svg"
          width="59"
          height="58"
          viewBox="0 0 62 61"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M31 1.5C14.7076 1.5 1.5 14.4837 1.5 30.5C1.5 46.5163 14.7076 59.5 31 59.5C47.2924 59.5 60.5 46.5163 60.5 30.5C60.5 14.4837 47.2924 1.5 31 1.5Z"
            fill="#F5E600"
          />
          <path d="M31 42.1L42.8 30.5L31 18.9" fill="#F5E600" />
          <path
            d="M31 18.9L42.8 30.5L31 42.1M42.8 30.5L19.2 30.5M1.5 30.5C1.5 14.4837 14.7076 1.5 31 1.5C47.2924 1.5 60.5 14.4837 60.5 30.5C60.5 46.5163 47.2924 59.5 31 59.5C14.7076 59.5 1.5 46.5163 1.5 30.5Z"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#000"
          />
        </svg>
      </Link>
      <div className="idea-rule idea-rule-header" aria-hidden="true" />
      <div className="idea-rule idea-rule-content" aria-hidden="true" />
    </>
  );
}
