const SITE = {
  phoneDisplay: '+971 50 123 4567',
  phoneRaw: '971501234567',
  email: 'info@bestcateringdubai.com'
};

document.getElementById('phoneLink').href = `https://wa.me/${SITE.phoneRaw}`;
document.getElementById('phoneLink').textContent = SITE.phoneDisplay;
document.getElementById('emailLink').href = `mailto:${SITE.email}`;
document.getElementById('emailLink').textContent = SITE.email;
document.getElementById('cta').href = `https://wa.me/${SITE.phoneRaw}`;
document.getElementById('year').textContent = new Date().getFullYear();
