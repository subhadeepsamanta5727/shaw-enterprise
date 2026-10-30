import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsBaseDir = path.join(__dirname, '..', 'uploads');

const imagesToDownload = {
  // Categories
  'categories/writing-boards.jpg': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  'categories/display-notice-boards.jpg': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
  'categories/magnetic-writing-boards.jpg': 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  'categories/graph-writing-boards.jpg': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
  'categories/metal-stands.jpg': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  'categories/wooden-products.jpg': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
  'categories/acrylic-products.jpg': 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
  'categories/boxes.jpg': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
  'categories/school-office-furniture.jpg': 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',

  // Writing Boards
  'products/main/whiteboard.jpg': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  'products/main/blackboard.jpg': 'https://images.unsplash.com/photo-1584697964190-7bb0db32e65d?auto=format&fit=crop&w=800&q=80',
  'products/main/green-chalkboard.jpg': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  'products/main/glass-whiteboard.jpg': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
  'products/main/acrylic-whiteboard.jpg': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',

  // Display Notice Boards
  'products/main/notice-board.jpg': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',
  'products/main/cover-notice-board.jpg': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
  'products/main/key-hanger-board.jpg': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
  'products/main/exhibition-board.jpg': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  'products/main/cork-board.jpg': 'https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&w=800&q=80',
  'products/main/grooved-board.jpg': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',

  // Magnetic Writing Boards
  'products/main/magnetic-whiteboard.jpg': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  'products/main/magnetic-green-board.jpg': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  'products/main/magnetic-glass-board.jpg': 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',

  // Graph Writing Boards
  'products/main/white-graph-board.jpg': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
  'products/main/black-graph-board.jpg': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'products/main/green-graph-board.jpg': 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=800&q=80',

  // Metal Stands
  'products/main/3leg-stand.jpg': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  'products/main/4leg-stand.jpg': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
  'products/main/trolley-stand.jpg': 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
  'products/main/revolving-stand.jpg': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
  'products/main/lobby-stand.jpg': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  'products/main/flip-chart-stand.jpg': 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
  'products/main/magazine-stand.jpg': 'https://images.unsplash.com/photo-1507842229451-79b1be8d1a1b?auto=format&fit=crop&w=800&q=80',
  'products/main/folding-stand.jpg': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',

  // Wooden Products
  'products/main/wooden-easel.jpg': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
  'products/main/canvas-board.jpg': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
  'products/main/wooden-duster.jpg': 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
  'products/main/geo-box.jpg': 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?auto=format&fit=crop&w=800&q=80',
  'products/main/wooden-pen-stand.jpg': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=800&q=80',

  // Acrylic Products
  'products/main/desk-elevator.jpg': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
  'products/main/name-plate.jpg': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  'products/main/menu-holder.jpg': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
  'products/main/qr-stand.jpg': 'https://images.unsplash.com/photo-1595079672139-54708d7e63b6?auto=format&fit=crop&w=800&q=80',
  'products/main/acrylic-display.jpg': 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=800&q=80',
  'products/main/info-holder.jpg': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80',

  // Boxes
  'products/main/letter-box.jpg': 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
  'products/main/first-aid-box.jpg': 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80',
  'products/main/suggestion-box.jpg': 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?auto=format&fit=crop&w=800&q=80',
  'products/main/key-box.jpg': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',

  // School & Office Furniture
  'products/main/classroom-desk.jpg': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'products/main/lab-table.jpg': 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  'products/main/library-rack.jpg': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
  'products/main/office-desk.jpg': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
  'products/main/workstation.jpg': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
  'products/main/reception-counter.jpg': 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=800&q=80',

  // Blogs
  'blogs/whiteboard-guide.jpg': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
  'blogs/cleaning-tips.jpg': 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80',
};

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      // Already downloaded
      return resolve(dest);
    }

    const file = fs.createWriteStream(dest);
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return https.get(res.headers.location, (redRes) => {
            redRes.pipe(file);
            file.on('finish', () => file.close(() => resolve(dest)));
          }).on('error', reject);
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(dest)));
      })
      .on('error', (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function run() {
  console.log(`📥 Downloading all images to local folder: ${uploadsBaseDir}`);
  let count = 0;
  for (const [relPath, url] of Object.entries(imagesToDownload)) {
    const dest = path.join(uploadsBaseDir, relPath);
    try {
      await downloadImage(url, dest);
      count++;
      process.stdout.write(`\r✅ Downloaded [${count}/${Object.keys(imagesToDownload).length}]: ${relPath}`);
    } catch (e) {
      console.error(`\n❌ Failed to download ${relPath}:`, e.message);
    }
  }
  console.log('\n🎉 All images successfully stored in local folder!');
}

run();

