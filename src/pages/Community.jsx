import { useState } from 'react';
import { useStore } from '../store/Store';
import { Link, useRouter } from '../store/router';
import { COMMUNITY_TOPICS } from '../data/mock';
import { Img, Fab, Empty, TopBar, Avatar } from '../components/UI';
import { ISearch, IChat, IHeart, IBack, ISend, IMore } from '../components/Icons';
import { ago, fileToDataUrl } from '../utils';

export default function Community() {
  const { state } = useStore();
  const [topic, setTopic] = useState('전체');
  const [q, setQ] = useState('');
  const posts = state.posts
    .filter((p) => !state.blocked.includes(p.authorId))
    .filter((p) => topic === '전체' || p.topic === topic)
    .filter((p) => !q || (p.title + p.body).includes(q))
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="page">
      <header className="topbar"><h1 className="topbar-title left">동네생활</h1></header>
      <div className="pad-x">
        <label className="search-field soft"><ISearch size={18} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`${state.me.region} 이웃들의 이야기 검색`} /></label>
      </div>
      <div className="chips">{COMMUNITY_TOPICS.map((t) => <button key={t} className={`chip ${topic === t ? 'is-on' : ''}`} onClick={() => setTopic(t)}>{t}</button>)}</div>
      {posts.length === 0 ? <Empty icon="💬" title="아직 이야기가 없어요" desc="동네 이웃에게 첫 이야기를 건네보세요." /> :
        <div className="posts">{posts.map((p) => {
          const a = p.authorId === 'me' ? { ...state.users.me, ...state.me } : state.users[p.authorId];
          return (
            <Link key={p.id} to={`/community/${p.id}`} className="post">
              <span className="post-topic">{p.topic}</span>
              <div className="post-main">
                <div><h3>{p.title}</h3><p className="post-body">{p.body}</p></div>
                {p.image && <div className="post-img"><Img src={p.image} alt="" seed={p.id} /></div>}
              </div>
              <p className="meta">{a?.nickname} · {p.region} · {ago(p.createdAt)}</p>
              <div className="post-counts"><span><IHeart size={15} /> 공감 {p.likes}</span><span><IChat size={15} /> 댓글 {p.comments.length}</span></div>
            </Link>);
        })}</div>}
      <Fab to="/community/write" />
    </div>
  );
}

export function PostDetail({ id }) {
  const { state, dispatch, user, uid, showToast } = useStore();
  const { navigate } = useRouter();
  const [text, setText] = useState('');
  const p = state.posts.find((x) => x.id === id);
  if (!p) return <div className="page"><TopBar back /><Empty icon="🫥" title="삭제된 게시글이에요" /></div>;
  const a = user(p.authorId);
  const liked = state.postLikes.includes(p.id);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch({ type: 'ADD_COMMENT', postId: p.id, comment: { id: uid('cm'), authorId: 'me', text: text.trim(), createdAt: Date.now() } });
    setText('');
  };

  return (
    <div className="page has-actionbar">
      <TopBar back title="" right={p.authorId === 'me' && <button className="icon-btn" aria-label="삭제" onClick={() => { if (confirm('게시글을 삭제할까요?')) { dispatch({ type: 'DELETE_POST', id: p.id }); showToast('삭제했어요'); navigate('/community', { replace: true }); } }}><IMore /></button>} />
      <article className="pad">
        <span className="post-topic">{p.topic}</span>
        <Link to={`/users/${a.id}`} className="author"><Avatar user={a} size={36} /><div><strong>{a.nickname}</strong><p className="meta">{p.region} · {ago(p.createdAt)}</p></div></Link>
        <h2 className="detail-title">{p.title}</h2>
        <p className="detail-desc">{p.body}</p>
        {p.image && <div className="post-full-img"><Img src={p.image} alt="" seed={p.id} /></div>}
        <button className={`empathy ${liked ? 'is-on' : ''}`} onClick={() => dispatch({ type: 'TOGGLE_POST_LIKE', id: p.id })} aria-pressed={liked}>
          <IHeart size={18} filled={liked} /> 공감하기 {p.likes}
        </button>
      </article>
      <section className="pad section">
        <h3 className="section-title">댓글 {p.comments.length}</h3>
        {p.comments.length === 0 && <p className="meta">첫 댓글을 남겨보세요.</p>}
        {p.comments.map((c) => { const cu = user(c.authorId); return (
          <div key={c.id} className="comment"><Avatar user={cu} size={30} /><div><strong>{cu.nickname}</strong> <span className="meta">{ago(c.createdAt)}</span><p>{c.text}</p></div></div>); })}
      </section>
      <form className="actionbar composer" onSubmit={submit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="댓글을 입력해 주세요" aria-label="댓글" />
        <button className="icon-btn send" disabled={!text.trim()} aria-label="댓글 등록"><ISend /></button>
      </form>
    </div>
  );
}

export function CommunityWrite() {
  const { state, dispatch, uid, showToast } = useStore();
  const { navigate } = useRouter();
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const ok = topic && title.trim() && body.trim();
  return (
    <div className="page has-actionbar">
      <TopBar back title="동네생활 글쓰기" />
      <div className="pad form">
        <label className="field"><span>주제</span>
          <select className="input" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">게시글의 주제를 선택해 주세요</option>
            {COMMUNITY_TOPICS.slice(1).map((t) => <option key={t}>{t}</option>)}
          </select></label>
        <label className="field"><span>제목</span><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" /></label>
        <label className="field"><span>내용</span><textarea className="input" rows={8} value={body} onChange={(e) => setBody(e.target.value)} placeholder={`${state.me.region} 이웃과 나누고 싶은 이야기를 적어주세요.`} /></label>
        <label className="btn ghost">사진 첨부<input type="file" accept="image/*" hidden onChange={async (e) => e.target.files[0] && setImage(await fileToDataUrl(e.target.files[0]))} /></label>
        {image && <div className="post-full-img"><img src={image} alt="첨부 사진 미리보기" /></div>}
      </div>
      <div className="actionbar"><button className="btn block" disabled={!ok} onClick={() => {
        const id = uid('c');
        dispatch({ type: 'ADD_POST', post: { id, topic, title: title.trim(), body: body.trim(), image, authorId: 'me', region: state.me.region, createdAt: Date.now(), likes: 0, comments: [] } });
        showToast('게시글을 올렸어요'); navigate(`/community/${id}`, { replace: true });
      }}>완료</button></div>
    </div>
  );
}
