const fs = require('fs');
const file = 'D:/root2/ai-measure-uniapp/pages/measure/index.vue';
let c = fs.readFileSync(file, 'utf-8');

// 1. 找到弹窗模板中的 +/- 按钮，加上条件 v-if="optPopup.itemType == 'sign' || optPopup.itemType == 'check'"
// 找到 + 按钮
const plusBtn = c.match(/<text[^>]*class="[^"]*font[^"]*"[^>]*>[\s\S]*?\+[\s\S]*?<\/text>/);
if (plusBtn) {
    const oldPlus = plusBtn[0];
    if (!oldPlus.includes('v-if')) {
        const newPlus = oldPlus.replace('<text', '<text v-if="optPopup.itemType == \'sign\' || optPopup.itemType == \'check\'"');
        c = c.replace(oldPlus, newPlus);
        console.log('+ button condition added');
    }
}

// 找到 - 按钮（类似的 font class）
// 用更精确的方式：找 ygSetTj 区域内的 + 和 -
const tjStart = c.indexOf('class="ygSetTj"');
const tjEnd = c.indexOf('</view>', tjStart + 200);
let tjSection = c.substring(tjStart, tjEnd);

// 给所有 class="font" 的 text 加 v-if 条件
// 先处理还没加条件的
tjSection = tjSection.replace(
    /<text class="font"(?! v-if)/g,
    '<text class="font" v-if="optPopup.itemType == \'sign\' || optPopup.itemType == \'check\'"'
);
tjSection = tjSection.replace(
    /<text class="font active"(?! v-if)/g,
    '<text class="font active" v-if="optPopup.itemType == \'sign\' || optPopup.itemType == \'check\'"'
);
// 也处理动态class绑定的
tjSection = tjSection.replace(
    /:class="\{'font active'/g,
    'v-if="optPopup.itemType == \'sign\' || optPopup.itemType == \'check\'" :class="{\'font active\''
);

c = c.substring(0, tjStart) + tjSection + c.substring(tjEnd);

// 2. 去掉"关闭"按钮
// 找到包含"关闭"或 optVirtualKeyboard 的 text
c = c.replace(/<text[^>]*>[\s\S]*?\{\{\s*\$t\('measure\.optVirtualKeyboard'\)\s*\}\}[\s\S]*?<\/text>/g, '');
// 也试直接文字
c = c.replace(/<text[^>]*>\s*<span>关闭<\/span>\s*<\/text>/g, '');

fs.writeFileSync(file, c, 'utf-8');
console.log('Done');
