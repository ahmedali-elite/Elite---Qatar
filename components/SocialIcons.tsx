import React from 'react';
// FIX: Correctly import Variants from framer-motion to resolve typing issues.
import { motion, type Variants } from 'framer-motion';
import { FaXTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa6';
import { useLanguage } from '../i18n/LanguageContext';

// FIX: Explicitly typed iconVariants with Variants to fix type error
const iconVariants: Variants = {
  hover: {
    scale: 1.2,
    y: -5,
    transition: { type: 'spring', stiffness: 300 },
  },
  tap: { scale: 0.9 },
};

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
const SocialIcons = () => {
  const { t } = useLanguage();
  const shareUrl = typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '';
  const shareText = encodeURIComponent(t('share.text'));
  const shareTitle = encodeURIComponent(t('share.title'));

  const socialLinks = [
    {
      name: 'Twitter',
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`,
      color: 'text-black hover:text-gray-700'
    },
    {
      name: 'LinkedIn',
      icon: FaLinkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${shareTitle}&summary=${shareText}`,
      color: 'text-[#0A66C2] hover:text-[#0854a0]'
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${shareText}`,
      color: 'text-[#1877F2] hover:text-[#1464c9]'
    },
  ];

  return (
    <div className="flex justify-center items-center gap-8">
        {socialLinks.map(({ name, icon: Icon, href, color }) => (
            <motion.a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                variants={iconVariants}
                whileHover="hover"
                whileTap="tap"
                className={`p-2 transition-colors duration-300 ${color}`}
                aria-label={`Share on ${name}`}
            >
                <Icon size={32} />
            </motion.a>
        ))}
    </div>
  );
};

export default SocialIcons;
