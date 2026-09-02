import { useEffect, useMemo, useState } from 'react';
import { Bell, CalendarDays, Check, ChevronDown, CircleHelp, Folder, Inbox, LayoutGrid, List, Menu, Moon, MoreHorizontal, Plus, Search, Settings, Sparkles, Sun, Tag, X } from 'lucide-react';

type Task = { id:number; title:string; project:string; date:string; priority:'High'|'Medium'|'Low'; tag:string; done:boolean };
const projects = [{name:'Inbox',icon:Inbox,count:3,color:'#8066f4'},{name:'Work',icon:Folder,count:8,color:'#f39b56'},{name:'Personal',icon:Folder,count:5,color:'#51bda6'},{name:'Ideas',icon:Sparkles,count:2,color:'#ed7095'}];

export default function App(){
 const [tasks,setTasks]=useState<Task[]>(()=>{try{return JSON.parse(localStorage.getItem('taskflow-tasks-personal')||'[]')}catch{return []}});
 const [active,setActive]=useState('Inbox'),[query,setQuery]=useState(''),[filter,setFilter]=useState('All tasks'),[view,setView]=useState<'list'|'calendar'>('list'),[dark,setDark]=useState(false),[showAdd,setShowAdd]=useState(false),[mobile,setMobile]=useState(false);
 useEffect(()=>localStorage.setItem('taskflow-tasks-personal',JSON.stringify(tasks)),[tasks]);
 const completedTasks=tasks.filter(t=>t.done).length;
 const productivity=tasks.length===0?0:Math.round((completedTasks/tasks.length)*100);
 const visible=useMemo(()=>tasks.filter(t=>{
  const taskProject=String(t.project||'').trim().toLowerCase();
  const selectedProject=active.trim().toLowerCase();
  const inProject=active==='Inbox'||taskProject===selectedProject;
  const text=`${t.title} ${t.tag} ${t.project}`.toLowerCase();
  const matchesSearch=!query||text.includes(query.trim().toLowerCase());
  const matchesFilter=filter==='All tasks'||(filter==='Completed'?t.done:t.priority===filter);
  return inProject&&matchesSearch&&matchesFilter;
 }),[tasks,active,query,filter]);
 const toggle=(id:number)=>setTasks(ts=>ts.map(t=>t.id===id?{...t,done:!t.done}:t));
 const remove=(id:number)=>{if(window.confirm('Delete this task?'))setTasks(ts=>ts.filter(t=>t.id!==id));};
 const add=(title:string)=>{if(title.trim())setTasks(ts=>[{id:Date.now(),title,project:active==='Inbox'?'Work':active,date:'Today',priority:'Medium',tag:'New',done:false},...ts]);setShowAdd(false)};
 return <div className={dark?'app dark':'app'}>
  <aside className={mobile?'sidebar open':'sidebar'}><div className="brand"><span className="brand-mark"><Check size={19}/></span><span>taskflow</span><button className="close-mobile" onClick={()=>setMobile(false)}><X size={18}/></button></div>
   <button className="add-task" onClick={()=>setShowAdd(true)}><Plus size={17}/> Add task <kbd>⌘ N</kbd></button>
   <nav><p className="nav-label">Workspace</p>{projects.map(p=>{const Icon=p.icon;return <button key={p.name} className={active===p.name?'nav-item active':'nav-item'} onClick={()=>{setActive(p.name);setMobile(false)}}><Icon size={17} color={p.color}/><span>{p.name}</span><em>{p.count}</em></button>})}</nav>
   <div className="sidebar-bottom"><button className="nav-item"><Tag size={17}/><span>Tags</span></button><button className="nav-item"><Settings size={17}/><span>Settings</span></button><div className="profile"><div className="avatar">JD</div><div><strong>Ghazal M</strong><small>pro plan</small></div><MoreHorizontal size={17}/></div></div>
  </aside>
  {mobile&&<div className="scrim" onClick={()=>setMobile(false)}/>}<main><header><button className="mobile-menu" onClick={()=>setMobile(true)}><Menu/></button><div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>{active}</strong></div><div className="header-actions"><label className="search"><Search size={17}/><input placeholder="Search tasks" value={query} onChange={e=>setQuery(e.target.value)}/><kbd>⌘ K</kbd></label><button className="icon-button"><Bell size={18}/><i/></button><button className="icon-button" onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button><div className="mini-avatar">GM</div></div></header>
   <section className="content"><div className="welcome"><div><p className="eyebrow">Saturday, March 15, 2024</p><h1>Good morning, Ghazal <span>✦</span></h1><p className="subtitle">You have <b>{tasks.filter(t=>!t.done).length} tasks</b> to focus on today. Let’s make it a good one.</p></div><div className="streak"><span>🔥</span><div><b>day streak</b><small>Keep it going!</small></div></div></div>
    <div className="stats"><div><span className="stat-icon purple"><Check size={17}/></span><div><small>Completed</small><strong>{completedTasks}</strong></div></div><div><span className="stat-icon orange"><CalendarDays size={17}/></span><div><small>Due today</small><strong>{tasks.filter(t=>t.date==='Today'&&!t.done).length}</strong></div></div><div><span className="stat-icon green"><Sparkles size={17}/></span><div><small>Productivity</small><strong>{productivity}%</strong></div></div></div>
    <div className="task-heading"><div><h2>{active==='Inbox'?'All tasks':active}</h2><span>{visible.length} tasks</span></div><div className="controls"><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All tasks</option><option>High</option><option>Medium</option><option>Low</option><option>Completed</option></select><button className={view==='list'?'selected':''} onClick={()=>setView('list')}><List size={17}/></button><button className={view==='calendar'?'selected':''} onClick={()=>setView('calendar')}><LayoutGrid size={17}/></button></div></div>
    {view==='calendar'?<div className="calendar"><h3>March 2024</h3><div className="calendar-grid">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><b>{d}</b>)}{Array.from({length:31},(_,i)=><div className={i===14?'today':''}>{i+1}{tasks.some(t=>t.date==='Today'&&i===14)&&<span/>}</div>)}</div></div>:<div className="task-list">{visible.map(t=><article className={t.done?'task done':'task'} key={t.id}><button className="check" onClick={()=>toggle(t.id)}>{t.done&&<Check size={14}/>}</button><div className="task-body"><strong>{t.title}</strong><div><span className="project-dot"/> {t.project}<span className="divider">·</span><span>{t.tag}</span></div></div><span className={'priority '+t.priority.toLowerCase()}>{t.priority}</span><span className="task-date">{t.date}</span><button className="more" onClick={()=>remove(t.id)} title="Delete task"><MoreHorizontal size={18}/></button></article>)}{visible.length===0&&<div className="empty"><Sparkles size={24}/><h3>{tasks.length===0?'Get started with your first task':'No tasks found'}</h3><p>{tasks.length===0?'Capture something you want to accomplish today.':'Try a different search or create a new task.'}</p></div>}<button className="quick-add" onClick={()=>setShowAdd(true)}><Plus size={17}/> Add a task</button></div>}
   </section></main>{showAdd&&<AddModal onClose={()=>setShowAdd(false)} onAdd={add}/>}</div>
}
function AddModal({onClose,onAdd}:{onClose:()=>void;onAdd:(s:string)=>void}){const [value,setValue]=useState('');return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><div><h2>What needs doing?</h2><button onClick={onClose}><X size={18}/></button></div><input autoFocus placeholder="e.g. Plan the weekend" value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>e.key==='Enter'&&onAdd(value)}/><div className="modal-foot"><span>Press Enter to add</span><button onClick={()=>onAdd(value)}>Add task <Plus size={16}/></button></div></div></div>}
