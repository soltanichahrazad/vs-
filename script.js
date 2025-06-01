const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin');
const resultDiv = document.getElementById('result');
const removeLastBtn = document.getElementById('removeLast');

// إضافة عنصر لعداد الشخصيات المتبقية
const countDiv = document.createElement('div');
countDiv.style.marginTop = '20px';
countDiv.style.fontSize = '20px';
countDiv.style.fontWeight = 'bold';
countDiv.style.color = '#555';
resultDiv.parentNode.appendChild(countDiv);

// تحميل الشخصيات من localStorage أو استخدام القائمة الافتراضية
let segments = JSON.parse(localStorage.getItem('segments'));
if (!segments || !segments.length) {
  segments = [
    {text: 'iso', img: 'images/iso.png', color: '#9c27b0'},
    {text: 'Phoenix', img: 'images/prize2.png', color: '#4caf50'},
    {text: 'Sage', img: 'images/prize3.png', color: '#03a9f4'},
    {text: 'Sova', img: 'images/prize4.png', color: '#03a9f4'},
    {text: 'Raze', img: 'images/prize5.png', color: '#ff5722'},
    {text: 'Brimstone', img: 'images/prize6.png', color: '#673ab7'},
    {text: 'Viper', img: 'images/prize7.png', color: '#8bc34a'},
    {text: 'Omen', img: 'images/prize8.png', color: '#03a9f4'},
    {text: 'Cypher', img: 'images/prize9.png', color: '#ff5722'},
    {text: 'Killjoy', img: 'images/prize8.png', color: '#673ab7'},
    {text: 'Breach', img: 'images/prize8.png', color: '#8bc34a'},
    {text: 'Skye', img: 'images/prize8.png', color: '#ff4081'},
    {text: 'Yoru', img: 'images/prize8.png', color: '#607d8b'},
    {text: 'Astra', img: 'images/prize8.png', color: '#ffc107'},
    {text: 'KAY/O', img: 'images/prize8.png', color: '#607d8b'},
    {text: 'Chamber', img: 'images/prize8.png', color: '#cddc39'},
    {text: 'Neon', img: 'images/prize8.png', color: '#607d8b'},
    {text: 'Fade', img: 'images/prize8.png', color: '#cddc39'},
    {text: 'Vyse', img: 'images/prize8.png', color: '#795548'},
    {text: 'waylay', img: 'images/prize8.png', color: '#9c27b0'},
    {text: 'Tejo', img: 'images/prize8.png', color: '#4caf50'}
  ];
  localStorage.setItem('segments', JSON.stringify(segments));
}

const wheelRadius = 300;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let segmentAngle = 2 * Math.PI / segments.length;

let currentAngle = 0;
let spinning = false;

function drawSegment(index) {
  const startAngle = currentAngle + index * segmentAngle;
  const endAngle = startAngle + segmentAngle;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, wheelRadius, startAngle, endAngle);
  ctx.closePath();
  ctx.fillStyle = segments[index].color;
  ctx.fill();
  ctx.stroke();

  const angle = startAngle + segmentAngle / 2;
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const textX = centerX + Math.cos(angle) * (wheelRadius * 0.65);
  const textY = centerY + Math.sin(angle) * (wheelRadius * 0.65);
  ctx.fillText(segments[index].text, textX, textY);
}

function updateCount() {
  countDiv.textContent = `عدد الشخصيات المتبقية: ${segments.length}`;
}

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < segments.length; i++) {
    drawSegment(i);
  }
  updateCount();
}

function spin() {
  if (spinning || segments.length === 0) return;
  spinning = true;
  spinBtn.disabled = true;
  resultDiv.textContent = '';

  const spins = Math.floor(Math.random() * 20) + 30;
  const finalAngle = currentAngle + spins * 4 * Math.PI + Math.random() * 6 * Math.PI;

  let start = null;
  const duration = 12000;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    const progress = Math.min(elapsed / duration, 1);
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    currentAngle = currentAngle + (finalAngle - currentAngle) * easeOutProgress;

    drawWheel();

    if (elapsed < duration) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      spinBtn.disabled = false;
      showResult();
    }
  }
  requestAnimationFrame(animate);
}

function showResult() {
  const normalizedAngle = (currentAngle % (12 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  const index = Math.floor(segments.length - normalizedAngle / segmentAngle) % segments.length;
  const selected = segments[index];

  resultDiv.textContent = `الشخصية لي راح تلعب بيهاا ياحمار هيا ${selected.text}`;

  // حذف الشخصية من القائمة
  segments.splice(index, 1);

  // تحديث زاوية القطع
  if (segments.length > 0) {
    segmentAngle = 2 * Math.PI / segments.length;
    drawWheel();
  } else {
    resultDiv.textContent += "\nانتهت الشخصيات 🎉";
    spinBtn.disabled = true;
  }
  updateCount();

  // تحديث localStorage
  localStorage.setItem('segments', JSON.stringify(segments));
}

spinBtn.addEventListener('click', spin);

removeLastBtn.addEventListener('click', () => {
  if (segments.length === 0) {
    alert('ما في شخصيات للحذف!');
    return;
  }
  // حذف آخر شخصية
  segments.pop();

  if (segments.length > 0) {
    segmentAngle = 2 * Math.PI / segments.length;
  }

  drawWheel();
  updateCount();

  // تحديث localStorage
  localStorage.setItem('segments', JSON.stringify(segments));
});

drawWheel();
const addTextBtn = document.getElementById('addText');
const customTextInput = document.getElementById('customText');

addTextBtn.addEventListener('click', () => {
  const newText = customTextInput.value.trim();
  if (newText === '') {
    alert('الرجاء إدخال اسم شخصية.');
    return;
  }

  // إضافة شخصية جديدة بلون عشوائي وصورة افتراضية (تقدر تغيرها حسب رغبتك)
  const colors = ['#9c27b0', '#4caf50', '#03a9f4', '#ff5722', '#673ab7', '#8bc34a', '#ff4081', '#607d8b', '#ffc107', '#cddc39', '#795548'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  segments.push({
    text: newText,
    img: 'images/default.png', // استخدم صورة افتراضية أو ضع مسار مناسب
    color: randomColor
  });

  // تحديث زاوية القطع
  segmentAngle = 2 * Math.PI / segments.length;

  // تحديث العجلة والعداد
  drawWheel();
  updateCount();

  // تحديث التخزين المحلي
  localStorage.setItem('segments', JSON.stringify(segments));

  // مسح حقل الإدخال
  customTextInput.value = '';
});
