// 定义二叉树节点类
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

let root = null;

// ---------- 1. 构建二叉树 ----------
function buildTree() {
    const input = document.getElementById('treeData').value;
    const arr = JSON.parse(input);

    if (!arr || arr.length === 0) {
        root = null;
        alert("输入为空或格式错误！");
        return;
    }

    root = createTree(arr);
    updateAllDisplays();
}

function createTree(arr) {
    if (!arr.length) return null;

    let nodes = arr.map(val => val === null ? null : new TreeNode(val));
    let root = nodes[0];
    let queue = [root];
    let i = 1;

    while (queue.length && i < nodes.length) {
        let node = queue.shift();
        if (node) {
            node.left = nodes[i++] || null;
            queue.push(node.left);
            if (i < nodes.length) {
                node.right = nodes[i++] || null;
                queue.push(node.right);
            }
        }
    }
    return root;
}

// ---------- 2. 遍历 ----------
function preorderTraversal(node, res = []) {
    if (!node) return;
    res.push(node.val);
    preorderTraversal(node.left, res);
    preorderTraversal(node.right, res);
    return res;
}

function inorderTraversal(node, res = []) {
    if (!node) return;
    inorderTraversal(node.left, res);
    res.push(node.val);
    inorderTraversal(node.right, res);
    return res;
}

function postorderTraversal(node, res = []) {
    if (!node) return;
    postorderTraversal(node.left, res);
    postorderTraversal(node.right, res);
    res.push(node.val);
    return res;
}

function levelOrderTraversal(node) {
    if (!node) return [];
    let res = [];
    let queue = [node];
    while (queue.length) {
        let n = queue.shift();
        res.push(n.val);
        if (n.left) queue.push(n.left);
        if (n.right) queue.push(n.right);
    }
    return res;
}

// ---------- 3. 结构分析 ----------
function countNodes(node) {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
}

function countLeafNodes(node) {
    if (!node) return 0;
    if (!node.left && !node.right) return 1;
    return countLeafNodes(node.left) + countLeafNodes(node.right);
}

function treeHeight(node) {
    if (!node) return 0;
    return 1 + Math.max(treeHeight(node.left), treeHeight(node.right));
}

function nodesPerLevel(node) {
    if (!node) return [];
    let res = [];
    let queue = [node];
    while (queue.length) {
        let len = queue.length;
        res.push(len);
        for (let i = 0; i < len; i++) {
            let n = queue.shift();
            if (n.left) queue.push(n.left);
            if (n.right) queue.push(n.right);
        }
    }
    return res;
}

function maxWidth(node) {
    return Math.max(...nodesPerLevel(node));
}

// ---------- 4. 性质判断 ----------
function isEmptyTree(node) {
    return node === null;
}

function isFullBinaryTree(node) {
    if (!node) return true;
    if (!node.left && !node.right) return true;
    if (node.left && node.right) return isFullBinaryTree(node.left) && isFullBinaryTree(node.right);
    return false;
}

function isCompleteBinaryTree(node) {
    if (!node) return true;
    let queue = [node];
    let flag = false;
    while (queue.length) {
        let n = queue.shift();
        if (!n) {
            flag = true;
        } else {
            if (flag) return false;
            queue.push(n.left);
            queue.push(n.right);
        }
    }
    return true;
}

function isBalanced(node) {
    function check(node) {
        if (!node) return 0;
        let left = check(node.left);
        if (left === -1) return -1;
        let right = check(node.right);
        if (right === -1) return -1;
        if (Math.abs(left - right) > 1) return -1;
        return 1 + Math.max(left, right);
    }
    return check(node) !== -1;
}

function isBST(node, min = -Infinity, max = Infinity) {
    if (!node) return true;
    if (node.val <= min || node.val >= max) return false;
    return isBST(node.left, min, node.val) && isBST(node.right, node.val, max);
}

// ---------- 5. 路径查询 ----------
function findPath(node, target) {
    let path = [];
    function dfs(n) {
        if (!n) return false;
        path.push(n.val);
        if (n.val === target) return true;
        if (dfs(n.left) || dfs(n.right)) return true;
        path.pop();
        return false;
    }
    let found = dfs(node);
    return found ? path : null;
}

function findLevel(node, target) {
    if (!node) return -1;
    let queue = [{n: node, level: 1}];
    while (queue.length) {
        let {n, level} = queue.shift();
        if (n.val === target) return level;
        if (n.left) queue.push({n: n.left, level: level + 1});
        if (n.right) queue.push({n: n.right, level: level + 1});
    }
    return -1;
}

// ---------- 6. 文本可视化 ----------
function printTree(node, prefix = "", isLeft = true, res = []) {
    if (!node) return;
    if (node.right) printTree(node.right, prefix + (isLeft ? "│   " : "    "), false, res);
    res.push(prefix + (isLeft ? "└── " : "┌── ") + node.val);
    if (node.left) printTree(node.left, prefix + (isLeft ? "    " : "│   "), true, res);
    return res.join("\n");
}

// ---------- 更新显示 ----------
function updateAllDisplays() {
    document.getElementById("preorder").innerText = preorderTraversal(root).join(" ");
    document.getElementById("inorder").innerText = inorderTraversal(root).join(" ");
    document.getElementById("postorder").innerText = postorderTraversal(root).join(" ");
    document.getElementById("levelorder").innerText = levelOrderTraversal(root).join(" ");

    document.getElementById("totalNodes").innerText = countNodes(root);
    document.getElementById("leafNodes").innerText = countLeafNodes(root);
    document.getElementById("height").innerText = treeHeight(root);
    document.getElementById("nodesPerLevel").innerText = nodesPerLevel(root);
    document.getElementById("maxWidth").innerText = maxWidth(root);

    document.getElementById("isEmpty").innerText = isEmptyTree(root);
    document.getElementById("isFull").innerText = isFullBinaryTree(root);
    document.getElementById("isComplete").innerText = isCompleteBinaryTree(root);
    document.getElementById("isBalanced").innerText = isBalanced(root);
    document.getElementById("isBST").innerText = isBST(root);

    document.getElementById("treeVisual").innerText = printTree(root);
}

// ---------- 查询按钮 ----------
function searchValue() {
    const target = parseInt(document.getElementById("targetValue").value);
    const path = findPath(root, target);
    document.getElementById("exists").innerText = path ? "存在" : "不存在";
    document.getElementById("path").innerText = path ? path.join(" -> ") : "";
    document.getElementById("level").innerText = path ? findLevel(root, target) : "";
}
