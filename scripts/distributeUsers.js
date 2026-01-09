const fs = require('fs');
const path = require('path');

// Đọc file JSON
const filePath = path.join(__dirname, '../data/vietnamese-foods.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Danh sách user IDs
const userIds = [
    "fe0c54f1-92ce-4d0e-9f63-33c6206495a9",
    "ea12f415-38bc-4825-ae5a-c0c3b487c112",
    "b9b9c93e-0446-4946-9eaa-fe6f80361282",
    "15bb9c84-7d3f-43f2-989d-a26b77ecfa43"
];

// Chia đều món ăn cho các users
const totalFoods = data.foods.length;
const foodsPerUser = Math.floor(totalFoods / userIds.length);
const remainder = totalFoods % userIds.length;

console.log(`Tổng số món: ${totalFoods}`);
console.log(`Số user: ${userIds.length}`);
console.log(`Món/user: ${foodsPerUser} (+ ${remainder} món dư)\n`);

let currentIndex = 0;
userIds.forEach((userId, userIndex) => {
    // User đầu tiên nhận thêm món dư
    const count = userIndex === 0 ? foodsPerUser + remainder : foodsPerUser;

    console.log(`User ${userIndex + 1} (${userId}): món ${currentIndex + 1} - ${currentIndex + count}`);

    for (let i = 0; i < count; i++) {
        if (currentIndex < totalFoods) {
            data.foods[currentIndex].userId = userId;
            currentIndex++;
        }
    }
});

// Ghi lại file
fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('\n✅ Đã cập nhật thành công!');
