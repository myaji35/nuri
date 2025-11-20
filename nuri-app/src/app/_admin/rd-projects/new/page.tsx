'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { addRDProject, type RDProject } from '@/lib/rdProjectStore';

export default function NewRDProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    projectCode: '',
    projectName: '',
    category: 'smartfarm' as RDProject['category'],
    status: 'planning' as RDProject['status'],
    priority: 'medium' as RDProject['priority'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    leadResearcher: '',
    teamMembers: [] as string[],
    partnerOrganizations: [] as string[],
    totalBudget: 0,
    budgetUsed: 0,
    fundingSource: 'internal' as RDProject['fundingSource'],
    objective: '',
    description: '',
    expectedOutcome: '',
    keyTechnologies: [] as string[],
    progress: 0,
    tags: [] as string[],
    thumbnail: '/api/placeholder/800/600',
    milestones: [] as any[]
  });

  const [newTeamMember, setNewTeamMember] = useState('');
  const [newPartner, setNewPartner] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    targetDate: '',
    status: 'pending' as const
  });

  const categories = [
    { id: 'smartfarm', label: '스마트팜' },
    { id: 'automation', label: '자동화' },
    { id: 'ai', label: 'AI' },
    { id: 'iot', label: 'IoT' },
    { id: 'biotech', label: '바이오' },
    { id: 'sustainability', label: '지속가능성' },
    { id: 'other', label: '기타' }
  ];

  const statuses = [
    { id: 'planning', label: '기획중' },
    { id: 'ongoing', label: '진행중' },
    { id: 'completed', label: '완료' },
    { id: 'suspended', label: '중단' },
    { id: 'cancelled', label: '취소' }
  ];

  const priorities = [
    { id: 'high', label: '높음' },
    { id: 'medium', label: '보통' },
    { id: 'low', label: '낮음' }
  ];

  const fundingSources = [
    { id: 'internal', label: '내부 자금' },
    { id: 'government', label: '정부 지원' },
    { id: 'private', label: '민간 투자' },
    { id: 'partnership', label: '파트너십' },
    { id: 'mixed', label: '혼합' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      addRDProject({
        ...formData,
        milestones: formData.milestones.map((m, idx) => ({
          ...m,
          id: idx + 1
        }))
      });

      router.push('/admin/rd-projects');
    } catch (error) {
      console.error('Failed to save project:', error);
      setSaving(false);
    }
  };

  const addTeamMember = () => {
    if (newTeamMember && !formData.teamMembers.includes(newTeamMember)) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, newTeamMember]
      }));
      setNewTeamMember('');
    }
  };

  const removeTeamMember = (member: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter(m => m !== member)
    }));
  };

  const addPartner = () => {
    if (newPartner && !formData.partnerOrganizations.includes(newPartner)) {
      setFormData(prev => ({
        ...prev,
        partnerOrganizations: [...prev.partnerOrganizations, newPartner]
      }));
      setNewPartner('');
    }
  };

  const removePartner = (partner: string) => {
    setFormData(prev => ({
      ...prev,
      partnerOrganizations: prev.partnerOrganizations.filter(p => p !== partner)
    }));
  };

  const addTechnology = () => {
    if (newTechnology && !formData.keyTechnologies.includes(newTechnology)) {
      setFormData(prev => ({
        ...prev,
        keyTechnologies: [...prev.keyTechnologies, newTechnology]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      keyTechnologies: prev.keyTechnologies.filter(t => t !== tech)
    }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.targetDate) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, { ...newMilestone }]
      }));
      setNewMilestone({
        title: '',
        description: '',
        targetDate: '',
        status: 'pending'
      });
    }
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/rd-projects"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          뒤로 가기
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">새 R&D 프로젝트 등록</h1>
        <p className="text-gray-600 mt-2">새로운 연구개발 프로젝트를 등록합니다</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트 코드 *
              </label>
              <input
                type="text"
                value={formData.projectCode}
                onChange={(e) => setFormData(prev => ({ ...prev, projectCode: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="예: RD-2024-001"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                프로젝트명 *
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="프로젝트 이름"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태 *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                우선순위 *
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {priorities.map(priority => (
                  <option key={priority.id} value={priority.id}>{priority.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                진행률 (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시작일 *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종료일 (목표) *
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">팀 구성</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연구책임자 *
              </label>
              <input
                type="text"
                value={formData.leadResearcher}
                onChange={(e) => setFormData(prev => ({ ...prev, leadResearcher: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="책임자 이름"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                팀원
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTeamMember}
                  onChange={(e) => setNewTeamMember(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTeamMember())}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="팀원 이름"
                />
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.teamMembers.map((member, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {member}
                    <button type="button" onClick={() => removeTeamMember(member)} className="text-blue-500 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                협력 기관
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newPartner}
                  onChange={(e) => setNewPartner(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPartner())}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="협력 기관명"
                />
                <button
                  type="button"
                  onClick={addPartner}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.partnerOrganizations.map((partner, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full">
                    {partner}
                    <button type="button" onClick={() => removePartner(partner)} className="text-purple-500 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">재정 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                총 예산 (원) *
              </label>
              <input
                type="number"
                min="0"
                value={formData.totalBudget}
                onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                집행 예산 (원)
              </label>
              <input
                type="number"
                min="0"
                value={formData.budgetUsed}
                onChange={(e) => setFormData(prev => ({ ...prev, budgetUsed: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                자금 출처 *
              </label>
              <select
                value={formData.fundingSource}
                onChange={(e) => setFormData(prev => ({ ...prev, fundingSource: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                {fundingSources.map(source => (
                  <option key={source.id} value={source.id}>{source.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">프로젝트 내용</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연구 목표 *
              </label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="연구의 주요 목표를 간략히 작성하세요"
                rows={2}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상세 설명 *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="연구 내용을 상세히 작성하세요"
                rows={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                기대 효과 *
              </label>
              <textarea
                value={formData.expectedOutcome}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedOutcome: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="연구를 통해 기대되는 효과를 작성하세요"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                핵심 기술
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="핵심 기술"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.keyTechnologies.map((tech, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                    {tech}
                    <button type="button" onClick={() => removeTechnology(tech)} className="text-indigo-500 hover:text-red-500">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">마일스톤</h2>

          <div className="space-y-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="마일스톤 제목"
                />
              </div>
              <div>
                <input
                  type="date"
                  value={newMilestone.targetDate}
                  onChange={(e) => setNewMilestone(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <textarea
                value={newMilestone.description}
                onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="마일스톤 설명"
                rows={2}
              />
              <button
                type="button"
                onClick={addMilestone}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {formData.milestones.map((milestone, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <span className="text-sm text-gray-500">{milestone.targetDate}</span>
                  </div>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMilestone(idx)}
                  className="text-gray-400 hover:text-red-500 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">태그</h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="태그를 입력하세요"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              추가
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                #{tag}
                <button type="button" onClick={() => removeTag(tag)} className="text-gray-500 hover:text-red-500">
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/rd-projects"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saving ? '저장 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
