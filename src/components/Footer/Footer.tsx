import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/logo.svg";

const Footer = () => {
  return (
    <footer>
      <div className="flex justify-between items-center gap-2 p-4">
        <div className="logo">
          <Link href="/">
            <Image src={logo} alt="Maia DAO Logo" width={50} height={50} />
          </Link>
        </div>
        <nav className="flex px-8 gap-12 text-white">
          <a href="https://linktr.ee/maiadao" color="#ffffff">
            Relevant Links
          </a>
          <Link href="https://uni.maiadao.io/#/swap">Trade on UniMaia</Link>
          <Link href="https://hermes.maiadao.io/">Trade on Hermes</Link>
          <Link href="https://maiadao.io/">Stake on Maia</Link>
        </nav>
      </div>
      <style jsx>{`
        footer {
          background-color: #0d111c;
          padding: 20px 0;
          position: fixed;
          bottom: 0;
          width: 100%;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
