// const express = require('express');
// const router = express.Router();
// const Posts = require('../schemas/post');

// // 게시글 생성 : POST -> localhost:3000/posts
// router.post('/', async (req, res) => {
//     try {
//         const { postId, user, password, title, content } = req.body;
//         const post = await Posts.find({ postId });
//         if (post.length) {
//             return res.status(404).send({ message: "이미 있는 데이터입니다." });
//         };
//         await Posts.create({ postId, user, password, title, content });
//         return res.status(200).json({ message: '게시글을 생성하였습니다.' })
//     } catch {
//         return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
//     }
// });
// // 게시글 전체 조회
// router.get('/', async (req, res) => {
//     try {
//         const post = await Posts.find({}, { "_id": 0, "password": 0, "__v": 0 });
//         // Posts.find({조건문}, {결과})
//         res.json({ data: post });
//     } catch {
//         return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
//     }
// });
// // 게시글 상세 조회 : GET -> localhost:3000/posts/:postId
// router.get('/:postId', async (req, res) => {
//     try {
//         const postId = req.params.postId;
//         const post = await Posts.findOne({ postId: postId }, { "_id": 0, "password": 0, "__v": 0 });
//         if (!post) {
//             return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
//         }
//         res.json({ data: post });
//     } catch {
//         return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
//     }
// });
// // 게시글 수정 : PUT -> localhost:3000/posts/:postId
// router.put('/:postId', async (req, res) => {
//     try {
//         const postId = req.params.postId;
//         const { password, title, content } = req.body;
//         const [post] = await Posts.find({ postId });
//         if (!post) {
//             return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
//         }
//         if (password === post.password) {
//             await Posts.updateOne({ postId }, { $set: { title, content } });
//             return res.status(200).json({ message: '게시글을 수정하였습니다.' })
//         } else {
//             return res.status(400).json({ message: '비밀번호가 다릅니다.' });
//         }
//     } catch {
//         return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
//     }
// });
// // 게시글 삭제 : DELETE -> localhost:3000/posts/:postId
// router.delete('/:postId', async (req, res) => {
//     try {
//         const { postId } = req.params;
//         const { password } = req.body;
//         const [post] = await Posts.find({ postId });
//         if (!post) {
//             return res.status(400).json({ message: '게시글 조회에 실패하였습니다.' });
//         }
//         if (password === post.password) {
//             await Posts.deleteOne({ postId });
//             return res.status(200).json({ message: '게시글을 삭제하였습니다.' })
//         } else {
//             return res.status(400).json({ message: '비밀번호가 다릅니다.' });
//         }
//     } catch {
//         return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
//     }
// });

// module.exports = router; // module.exports를 사용하여 app.js로 내보내주고 있다.


const express = require('express');
const router = express.Router();

const Posts = require('../schemas/post.js');


// 게시글 생성
router.post('/', async (req, res) => {
    try {
        const { user, password, title, content } = req.body;
        await Posts.create({ user, password, title, content });
        return res.status(200).json({ message: '게시글을 생성하였습니다.' })
    } catch {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }

});


// 게시글 조회
router.get('/', async (req, res) => {
    const post = await Posts.find({}, { "__v": 0, "password": 0, "content": 0 });
    const postPrint = post.map((value) => {
        return {
            postId: value._id,
            user: value.user,
            title: value.title,
            createdAt: value.createdAt
        }
    })
    res.json({ data: postPrint });
});


// 게시글 상세조회
router.get('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const post = await Posts.findOne({ _id: _postId }, { "password": 0, "__v": 0 });
        const postPrint = {
            postId: post._id,
            user: post.user,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt
        };
        res.json({ data: postPrint });
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});


// 게시글 수정
router.put('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const { password, title, content } = req.body;
        const [post] = await Posts.find({ _id: _postId });
        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
        }
        if (password === post.password) {
            await Posts.updateOne({ _id: _postId }, { $set: { title: title, content: content } })
            return res.status(200).json({ message: '게시글을 수정하였습니다.' });
        } else {
            return res.status(404).json({ message: '비밀번호가 다릅니다.' });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});


// 게시글 삭제 
router.delete('/:_postId', async (req, res) => {
    try {
        const { _postId } = req.params;
        const { password } = req.body;
        const [post] = await Posts.find({ _id: _postId });

        if (!post) {
            return res.status(404).json({ message: '게시글 조회에 실패하였습니다.' });
        }

        if (password === post.password) {
            await Posts.deleteOne({ _id: _postId });
            return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
        } else {
            return res.status(404).json({ message: '비밀번호가 다릅니다.' });
        }
    } catch {
        res.status(400).send({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});



module.exports = router;