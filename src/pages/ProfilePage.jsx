import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  User, Briefcase, GraduationCap, Code2, Award, Github,
  Globe, Phone, Mail, MapPin, Plus, Trash2, Save, CheckCircle2,
  Edit3, Linkedin
} from 'lucide-react';

const tabs = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Code2 },
  { id: 'projects', label: 'Projects', icon: Github },
  { id: 'certifications', label: 'Certifications', icon: Award },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    api.get('/profile').then(({ data }) => setProfile(data));
  }, []);

  const save = async () => {
    setSaving(true);
    await api.put('/profile', profile);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updatePersonal = (key, val) =>
    setProfile(p => ({ ...p, personalDetails: { ...p.personalDetails, [key]: val } }));

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setProfile(p => ({ ...p, skills: [...(p.skills || []), newSkill.trim()] }));
    setNewSkill('');
  };

  const removeSkill = (skill) =>
    setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));

  const addExperience = () => setProfile(p => ({
    ...p, experience: [...(p.experience || []), {
      id: Date.now().toString(), company: '', role: '', duration: '', location: '', description: '', technologies: []
    }]
  }));

  const updateExperience = (id, key, val) =>
    setProfile(p => ({ ...p, experience: p.experience.map(e => e.id === id ? { ...e, [key]: val } : e) }));

  const removeExperience = (id) =>
    setProfile(p => ({ ...p, experience: p.experience.filter(e => e.id !== id) }));

  const addEducation = () => setProfile(p => ({
    ...p, education: [...(p.education || []), { id: Date.now().toString(), institution: '', degree: '', year: '', grade: '' }]
  }));

  const updateEducation = (id, key, val) =>
    setProfile(p => ({ ...p, education: p.education.map(e => e.id === id ? { ...e, [key]: val } : e) }));

  const removeEducation = (id) =>
    setProfile(p => ({ ...p, education: p.education.filter(e => e.id !== id) }));

  const addProject = () => setProfile(p => ({
    ...p, projects: [...(p.projects || []), { id: Date.now().toString(), name: '', description: '', tech: [], link: '' }]
  }));

  const updateProject = (id, key, val) =>
    setProfile(p => ({ ...p, projects: p.projects.map(pr => pr.id === id ? { ...pr, [key]: val } : pr) }));

  const removeProject = (id) =>
    setProfile(p => ({ ...p, projects: p.projects.filter(pr => pr.id !== id) }));

  const addCert = () => setProfile(p => ({
    ...p, certifications: [...(p.certifications || []), { id: Date.now().toString(), name: '', issuer: '', year: '' }]
  }));

  const updateCert = (id, key, val) =>
    setProfile(p => ({ ...p, certifications: p.certifications.map(c => c.id === id ? { ...c, [key]: val } : c) }));

  const removeCert = (id) =>
    setProfile(p => ({ ...p, certifications: p.certifications.filter(c => c.id !== id) }));

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const completeness = Math.min(100, Math.round(
    ([profile.personalDetails?.name, profile.personalDetails?.email,
      profile.skills?.length, profile.experience?.length,
      profile.education?.length, profile.projects?.length,
      profile.certifications?.length].filter(Boolean).length / 7) * 100
  ));

  return (
    <div className="space-y-6">
      {/* Header card */}
      <div className="card p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {profile.personalDetails?.name?.[0] || 'U'}
        </div>
        <div className="flex-1">
          <h2 className="font-display font-bold text-xl text-white">{profile.personalDetails?.name}</h2>
          <p className="text-slate-400 text-sm">{profile.personalDetails?.email}</p>
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-slate-400">Profile completeness</span>
              <span className="text-xs font-bold text-brand-400">{completeness}%</span>
            </div>
            <div className="progress-bar w-48">
              <div className="progress-fill" style={{ width: `${completeness}%` }} />
            </div>
          </div>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2 min-w-[120px] justify-center">
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> :
            saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Profile</>}
        </button>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Tabs sidebar */}
        <div className="lg:w-48 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 flex-shrink-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === id ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 card p-6 animate-fade-in">
          {/* Personal */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-white mb-4">Personal Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', icon: User, type: 'text' },
                  { key: 'email', label: 'Email', icon: Mail, type: 'email' },
                  { key: 'phone', label: 'Phone', icon: Phone, type: 'text' },
                  { key: 'location', label: 'Location', icon: MapPin, type: 'text' },
                  { key: 'linkedin', label: 'LinkedIn URL', icon: Linkedin, type: 'text' },
                  { key: 'github', label: 'GitHub URL', icon: Github, type: 'text' },
                  { key: 'portfolio', label: 'Portfolio URL', icon: Globe, type: 'text' },
                ].map(({ key, label, icon: Icon, type }) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Icon size={13} className="text-slate-500" /> {label}
                    </label>
                    <input type={type} className="input" value={profile.personalDetails?.[key] || ''}
                      onChange={e => updatePersonal(key, e.target.value)} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Edit3 size={13} className="text-slate-500" /> Professional Summary
                </label>
                <textarea rows={4} className="input resize-none" value={profile.personalDetails?.summary || ''}
                  onChange={e => updatePersonal('summary', e.target.value)}
                  placeholder="Brief professional summary..." />
              </div>
            </div>
          )}

          {/* Skills */}
          {activeTab === 'skills' && (
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Technical Skills</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills?.map(skill => (
                  <span key={skill} className="flex items-center gap-1.5 bg-brand-500/15 border border-brand-500/25 text-brand-300 text-sm px-3 py-1.5 rounded-full">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="text-brand-400/60 hover:text-red-400 transition-colors">
                      <Trash2 size={11} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input className="input flex-1" value={newSkill} onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                  placeholder="Add a skill (e.g. React, Python)..." />
                <button onClick={addSkill} className="btn-primary px-4"><Plus size={16} /></button>
              </div>
            </div>
          )}

          {/* Experience */}
          {activeTab === 'experience' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white">Work Experience</h3>
                <button onClick={addExperience} className="btn-secondary text-sm flex items-center gap-1.5">
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-4">
                {profile.experience?.map(exp => (
                  <div key={exp.id} className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex justify-end">
                      <button onClick={() => removeExperience(exp.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Company</label>
                        <input className="input text-sm py-2" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} placeholder="Company name" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Role / Title</label>
                        <input className="input text-sm py-2" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} placeholder="Job title" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Duration</label>
                        <input className="input text-sm py-2" value={exp.duration} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} placeholder="Jan 2022 – Present" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Location</label>
                        <input className="input text-sm py-2" value={exp.location} onChange={e => updateExperience(exp.id, 'location', e.target.value)} placeholder="City" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Description</label>
                      <textarea rows={3} className="input text-sm py-2 resize-none" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} placeholder="Key achievements and responsibilities..." />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Technologies (comma-separated)</label>
                      <input className="input text-sm py-2" value={Array.isArray(exp.technologies) ? exp.technologies.join(', ') : exp.technologies}
                        onChange={e => updateExperience(exp.id, 'technologies', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="React, Node.js, AWS..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {activeTab === 'education' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white">Education</h3>
                <button onClick={addEducation} className="btn-secondary text-sm flex items-center gap-1.5">
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-4">
                {profile.education?.map(edu => (
                  <div key={edu.id} className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex justify-end">
                      <button onClick={() => removeEducation(edu.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { key: 'institution', label: 'Institution' },
                        { key: 'degree', label: 'Degree' },
                        { key: 'year', label: 'Year' },
                        { key: 'grade', label: 'Grade / GPA' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                          <input className="input text-sm py-2" value={edu[key] || ''}
                            onChange={e => updateEducation(edu.id, key, e.target.value)} placeholder={label} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white">Projects</h3>
                <button onClick={addProject} className="btn-secondary text-sm flex items-center gap-1.5">
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-4">
                {profile.projects?.map(proj => (
                  <div key={proj.id} className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex justify-end">
                      <button onClick={() => removeProject(proj.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">Project Name</label>
                        <input className="input text-sm py-2" value={proj.name}
                          onChange={e => updateProject(proj.id, 'name', e.target.value)} placeholder="Project name" />
                      </div>
                      <div>
                        <label className="text-xs text-slate-400 mb-1 block">GitHub / URL</label>
                        <input className="input text-sm py-2" value={proj.link}
                          onChange={e => updateProject(proj.id, 'link', e.target.value)} placeholder="github.com/..." />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Description</label>
                      <textarea rows={2} className="input text-sm py-2 resize-none" value={proj.description}
                        onChange={e => updateProject(proj.id, 'description', e.target.value)} placeholder="Brief project description..." />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Tech Stack (comma-separated)</label>
                      <input className="input text-sm py-2" value={Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}
                        onChange={e => updateProject(proj.id, 'tech', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="React, Node.js..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {activeTab === 'certifications' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white">Certifications</h3>
                <button onClick={addCert} className="btn-secondary text-sm flex items-center gap-1.5">
                  <Plus size={14} /> Add
                </button>
              </div>
              <div className="space-y-4">
                {profile.certifications?.map(cert => (
                  <div key={cert.id} className="bg-white/3 border border-white/5 rounded-xl p-4 space-y-3">
                    <div className="flex justify-end">
                      <button onClick={() => removeCert(cert.id)} className="text-slate-500 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {[
                        { key: 'name', label: 'Certificate Name' },
                        { key: 'issuer', label: 'Issuer' },
                        { key: 'year', label: 'Year' },
                      ].map(({ key, label }) => (
                        <div key={key}>
                          <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                          <input className="input text-sm py-2" value={cert[key] || ''}
                            onChange={e => updateCert(cert.id, key, e.target.value)} placeholder={label} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
