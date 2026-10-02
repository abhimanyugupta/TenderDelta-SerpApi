/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Tender, MaterialChange, UserRoleView, ActionTask, TenderDocument, StructuredRequirement, ExtractionMethod, FactVerificationStatus } from './types';
import { DEMO_TENDER } from './data/demoTender';
import { deriveTaskDueDateFromDeadline } from './utils/slaPolicy';
import { 
  loadStoredTenders, 
  saveStoredTenders, 
  loadActiveTenderId, 
  saveActiveTenderId, 
  appendAuditEvent 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { NewTenderModal } from './components/NewTenderModal';
import { ChangeIntelligenceView } from './components/ChangeIntelligenceView';
import { SideBySideModal } from './components/SideBySideModal';
import { TimelineView } from './components/TimelineView';
import { RequirementMatrixView } from './components/RequirementMatrixView';
import { ActionCenterView } from './components/ActionCenterView';
import { BOQDeltaView } from './components/BOQDeltaView';
import { ConflictDetectorView } from './components/ConflictDetectorView';
import { EvidenceViewerModal } from './components/EvidenceViewerModal';
import { DocumentLibraryView } from './components/DocumentLibraryView';
import { ExecutiveSummaryView } from './components/ExecutiveSummaryView';
import { GroundedChatDrawer } from './components/GroundedChatDrawer';
import { MethodologyView } from './components/MethodologyView';
import { TeamSettingsView } from './components/TeamSettingsView';
import { OnboardingLanding } from './components/OnboardingLanding';
import { SubscriptionModal } from './components/SubscriptionModal';
import { ShareReportModal } from './components/ShareReportModal';
import { AuditTrailView } from './components/AuditTrailView';
import { AlertsCenterModal } from './components/AlertsCenterModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LegalDisclaimerFooter } from './components/LegalDisclaimerFooter';
import { SerpApiDiscoveryView } from './components/SerpApiDiscoveryView';

export default function App() {
  const [tenders, setTenders] = useState<Tender[]>(() => loadStoredTenders());
  const [activeTender, setActiveTender] = useState<Tender | null>(() => {
    const loaded = loadStoredTenders();
    const activeId = loadActiveTenderId();
    return loaded.find(t => t.id === activeId) || loaded[0] || DEMO_TENDER;
  });

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeRole, setActiveRole] = useState<UserRoleView>('ALL');
  const [isLandingMode, setIsLandingMode] = useState<boolean>(false);

  // Modals & Drawers
  const [isNewTenderModalOpen, setIsNewTenderModalOpen] = useState(false);
  const [sideBySideChange, setSideBySideChange] = useState<MaterialChange | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const [evidenceViewer, setEvidenceViewer] = useState<{
    isOpen: boolean;
    documentName: string;
    pageNumber?: number | null;
    sectionNumber?: string | null;
    exactSnippet: string;
    document?: TenderDocument | null;
    extractionMethod?: ExtractionMethod;
    verificationStatus?: FactVerificationStatus;
  }>({
    isOpen: false,
    documentName: '',
    pageNumber: null,
    exactSnippet: '',
    document: null
  });

  // Sync to localStorage whenever tenders list changes
  useEffect(() => {
    saveStoredTenders(tenders);
  }, [tenders]);

  // Sync active tender ID
  useEffect(() => {
    if (activeTender) {
      saveActiveTenderId(activeTender.id);
    }
  }, [activeTender]);

  // State Mutators
  const updateTenderState = (updatedTender: Tender) => {
    setActiveTender(updatedTender);
    setTenders(prev => prev.map(t => t.id === updatedTender.id ? updatedTender : t));
  };

  const handleConfirmChange = (changeId: string) => {
    if (!activeTender) return;
    const targetChange = activeTender.changes.find(c => c.id === changeId);
    const updatedChanges = activeTender.changes.map(c => 
      c.id === changeId ? { ...c, verificationStatus: 'CONFIRMED' as const } : c
    );
    let updatedTender = { ...activeTender, changes: updatedChanges };
    updatedTender = appendAuditEvent(
      updatedTender,
      'CHANGE_CONFIRMED',
      `Verified change: "${targetChange?.title || changeId}"`,
      'Current User',
      'BID_MANAGER',
      'VERIFICATION'
    );
    updateTenderState(updatedTender);
  };

  const handleFlagChange = (changeId: string, note: string) => {
    if (!activeTender) return;
    const targetChange = activeTender.changes.find(c => c.id === changeId);
    const updatedChanges = activeTender.changes.map(c => 
      c.id === changeId ? { ...c, verificationStatus: 'FLAGGED' as const, auditNotes: note } : c
    );
    let updatedTender = { ...activeTender, changes: updatedChanges };
    updatedTender = appendAuditEvent(
      updatedTender,
      'CHANGE_FLAGGED',
      `Flagged for legal clarification: "${targetChange?.title || changeId}". Reason: ${note}`,
      'Current User',
      'BID_MANAGER',
      'VERIFICATION'
    );
    updateTenderState(updatedTender);
  };

  const handleUpdateRequirementStatus = (reqId: string, newStatus: any) => {
    if (!activeTender) return;
    const targetReq = activeTender.requirements.find(r => r.id === reqId);
    const updatedReqs = activeTender.requirements.map(r => 
      r.id === reqId ? { ...r, status: newStatus } : r
    );
    let updatedTender = { ...activeTender, requirements: updatedReqs };
    updatedTender = appendAuditEvent(
      updatedTender,
      'REQUIREMENT_STATUS_UPDATED',
      `Updated requirement status to ${newStatus} for "${targetReq?.title || reqId}"`,
      'Current User',
      'BID_MANAGER',
      'VERIFICATION'
    );
    updateTenderState(updatedTender);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: any) => {
    if (!activeTender) return;
    const targetTask = activeTender.tasks.find(t => t.id === taskId);
    const updatedTasks = activeTender.tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    let updatedTender = { ...activeTender, tasks: updatedTasks };
    updatedTender = appendAuditEvent(
      updatedTender,
      'TASK_STATUS_UPDATED',
      `Marked task "${targetTask?.title || taskId}" as ${newStatus}`,
      'Current User',
      'BID_MANAGER',
      'TASK'
    );
    updateTenderState(updatedTender);
  };

  const handleAddTask = (newTask: Omit<ActionTask, 'id' | 'createdAt'>) => {
    if (!activeTender) return;
    const taskObj: ActionTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    let updatedTender = { ...activeTender, tasks: [taskObj, ...activeTender.tasks] };
    updatedTender = appendAuditEvent(
      updatedTender,
      'TASK_CREATED',
      `Assigned new action task: "${newTask.title}" to ${newTask.assignedTo}`,
      'Current User',
      'BID_MANAGER',
      'TASK'
    );
    updateTenderState(updatedTender);
  };

  const handleCreateTaskFromChange = (change: MaterialChange) => {
    const deadlineAnchor = activeTender?.currentSubmissionDeadline || activeTender?.originalSubmissionDeadline;
    const slaDerived = deriveTaskDueDateFromDeadline(deadlineAnchor, change.category);

    handleAddTask({
      title: `Review Amendment: ${change.title}`,
      description: `${change.actionRequired} (Cited from ${change.sourceCitation.documentName}, ${change.sourceCitation.pageNumber ? `page ${change.sourceCitation.pageNumber}` : 'page UNKNOWN'})`,
      assignedTo: change.relevantRoles.includes('FINANCE') ? 'Finance Controller' : 'Technical Bid Lead',
      role: change.relevantRoles[0] || 'BID_MANAGER',
      priority: change.materiality === 'CRITICAL' ? 'CRITICAL' : change.materiality === 'HIGH' ? 'HIGH' : 'MEDIUM',
      status: 'OPEN',
      dueDate: slaDerived.dueDateDisplay,
      slaPolicyRule: slaDerived.slaPolicyRule,
      daysBeforeDeadline: slaDerived.daysBeforeDeadline,
      isStaleDeadline: slaDerived.isStaleDeadline,
      staleWarning: slaDerived.staleWarning,
      changeIdRef: change.id,
      sourceCitation: change.sourceCitation
    });
    setCurrentTab('actions');
  };

  const handleUploadNewDoc = (newDoc: TenderDocument) => {
    if (!activeTender) return;
    const updatedDocs = [...activeTender.documents, newDoc];
    let updatedTender = { ...activeTender, documents: updatedDocs };
    updatedTender = appendAuditEvent(
      updatedTender,
      'DOCUMENT_INGESTED',
      `Ingested document ${newDoc.filename || newDoc.name} (${newDoc.type})`,
      'Current User',
      'BID_MANAGER',
      'INGESTION'
    );
    updateTenderState(updatedTender);
  };

  const handleCreateTender = (newTender: Tender) => {
    const updatedWithAudit = appendAuditEvent(
      newTender,
      'TENDER_WORKSPACE_CREATED',
      `Created workspace for ${newTender.title} (${newTender.referenceNumber}) with ${newTender.documents?.length || 0} documents.`,
      'Current User',
      'BID_MANAGER',
      'SETTINGS'
    );
    setTenders([updatedWithAudit, ...tenders]);
    setActiveTender(updatedWithAudit);
    setIsLandingMode(false);
    setCurrentTab('changes');
  };

  const handleOpenSourceViewer = (
    documentName: string, 
    pageNumber?: number | null, 
    exactSnippet?: string,
    extractionMethod?: ExtractionMethod,
    verificationStatus?: FactVerificationStatus,
    sectionNumber?: string | null
  ) => {
    const matchedDoc = activeTender?.documents.find(
      d => d.name === documentName || d.filename === documentName || d.title === documentName
    );

    setEvidenceViewer({
      isOpen: true,
      documentName,
      pageNumber: pageNumber ?? null,
      sectionNumber: sectionNumber ?? null,
      exactSnippet: exactSnippet || '',
      document: matchedDoc || null,
      extractionMethod,
      verificationStatus
    });
  };

  const criticalChangesCount = activeTender?.changes.filter(c => c.materiality === 'CRITICAL').length || 0;
  const openTasksCount = activeTender?.tasks.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length || 0;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 pb-16 md:pb-0">
      
      {/* Top Main Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setIsLandingMode(false);
          setCurrentTab(tab);
        }}
        activeTender={activeTender}
        allTenders={tenders}
        onSelectTender={(t) => {
          setActiveTender(t);
          setIsLandingMode(false);
        }}
        onOpenNewTender={() => setIsNewTenderModalOpen(true)}
        activeRole={activeRole}
        onRoleChange={(role) => setActiveRole(role)}
        onToggleAiChat={() => setIsAiChatOpen(!isAiChatOpen)}
        isAiChatOpen={isAiChatOpen}
        onOpenExportSummary={() => setCurrentTab('summary')}
        onOpenShareReport={() => setIsShareModalOpen(true)}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
        onOpenAlerts={() => setIsAlertsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {isLandingMode ? (
          <OnboardingLanding
            onAnalyseNewTender={() => setIsNewTenderModalOpen(true)}
            onViewDemo={() => {
              setActiveTender(DEMO_TENDER);
              setIsLandingMode(false);
              setCurrentTab('changes');
            }}
          />
        ) : (
          <>
            {/* View Router */}
            {currentTab === 'discovery' && <SerpApiDiscoveryView onOpenNewTender={() => setIsNewTenderModalOpen(true)} />}

            {currentTab === 'dashboard' && (
              <DashboardView
                tenders={tenders}
                activeTender={activeTender}
                onSelectTender={(t) => setActiveTender(t)}
                onOpenNewTender={() => setIsNewTenderModalOpen(true)}
                onNavigateToTab={(tab) => setCurrentTab(tab)}
                activeRole={activeRole}
                onOpenCitationModal={handleOpenSourceViewer}
              />
            )}

            {currentTab === 'changes' && activeTender && (
              <ChangeIntelligenceView
                tender={activeTender}
                activeRole={activeRole}
                onOpenSideBySide={(change) => setSideBySideChange(change)}
                onOpenSourceViewer={handleOpenSourceViewer}
                onConfirmChange={handleConfirmChange}
                onFlagChange={handleFlagChange}
                onCreateTaskFromChange={handleCreateTaskFromChange}
              />
            )}

            {currentTab === 'timeline' && activeTender && (
              <TimelineView
                tender={activeTender}
                onOpenSourceViewer={handleOpenSourceViewer}
                onSelectDocument={(doc) => handleOpenSourceViewer(doc.name || doc.filename, 1, doc.name || doc.filename)}
              />
            )}

            {currentTab === 'requirements' && activeTender && (
              <RequirementMatrixView
                tender={activeTender}
                activeRole={activeRole}
                onOpenSourceViewer={handleOpenSourceViewer}
                onUpdateRequirementStatus={handleUpdateRequirementStatus}
              />
            )}

            {currentTab === 'actions' && activeTender && (
              <ActionCenterView
                tender={activeTender}
                activeRole={activeRole}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onAddTask={handleAddTask}
                onOpenSourceViewer={handleOpenSourceViewer}
              />
            )}

            {currentTab === 'boq' && activeTender && (
              <BOQDeltaView
                tender={activeTender}
                onOpenSourceViewer={handleOpenSourceViewer}
              />
            )}

            {currentTab === 'conflicts' && activeTender && (
              <ConflictDetectorView
                tender={activeTender}
                onOpenSourceViewer={handleOpenSourceViewer}
              />
            )}

            {currentTab === 'documents' && activeTender && (
              <DocumentLibraryView
                tender={activeTender}
                onOpenSourceViewer={handleOpenSourceViewer}
                onUploadNewDoc={handleUploadNewDoc}
                onUpdateTender={updateTenderState}
              />
            )}

            {currentTab === 'audit' && activeTender && (
              <AuditTrailView
                tender={activeTender}
              />
            )}

            {currentTab === 'summary' && activeTender && (
              <ExecutiveSummaryView
                tender={activeTender}
                onClose={() => setCurrentTab('changes')}
              />
            )}

            {currentTab === 'methodology' && (
              <MethodologyView />
            )}

            {currentTab === 'team' && (
              <TeamSettingsView />
            )}
          </>
        )}

      </main>

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setIsLandingMode(false);
          setCurrentTab(tab);
        }}
        openCount={openTasksCount}
        criticalChangesCount={criticalChangesCount}
      />

      {/* Mandatory Statutory & Compliance Disclaimer */}
      <LegalDisclaimerFooter
        onOpenMethodology={() => setCurrentTab('methodology')}
        onOpenSubscription={() => setIsSubscriptionModalOpen(true)}
      />

      {/* Global Modals and Grounded AI Drawer */}
      <NewTenderModal
        isOpen={isNewTenderModalOpen}
        onClose={() => setIsNewTenderModalOpen(false)}
        onCreateTender={handleCreateTender}
      />

      <SideBySideModal
        change={sideBySideChange}
        onClose={() => setSideBySideChange(null)}
        onConfirmChange={handleConfirmChange}
        onFlagChange={handleFlagChange}
        onOpenSourceViewer={handleOpenSourceViewer}
      />

      <EvidenceViewerModal
        isOpen={evidenceViewer.isOpen}
        onClose={() => setEvidenceViewer({ ...evidenceViewer, isOpen: false })}
        documentName={evidenceViewer.documentName}
        pageNumber={evidenceViewer.pageNumber}
        sectionNumber={evidenceViewer.sectionNumber}
        exactSnippet={evidenceViewer.exactSnippet}
        document={evidenceViewer.document}
        extractionMethod={evidenceViewer.extractionMethod}
        verificationStatus={evidenceViewer.verificationStatus}
      />

      <GroundedChatDrawer
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        tender={activeTender}
        activeRole={activeRole}
        onOpenSourceViewer={handleOpenSourceViewer}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        currentPlan="Free"
        tenderCount={tenders.length}
      />

      <ShareReportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tender={activeTender}
      />

      <AlertsCenterModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        tender={activeTender}
        onNavigateToTab={(tab) => setCurrentTab(tab)}
      />

    </div>
  );
}
