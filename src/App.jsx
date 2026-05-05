import React, { useEffect, useRef, useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.jsx';
import { useCVData } from './hooks/useCVData.jsx';
import { CVPdfExporter } from './utils/pdfExporter.jsx';
import CVBuilderLayout from './components/CVBuilderLayout.jsx';
import PreviewContainer from './components/PreviewContainer.jsx';
import { isSupabaseConfigured, supabase } from './lib/supabaseClient.js';
import AuthScreen from './components/AuthScreen.jsx';

// Main App component
const AppContent = () => {
  const cvRef = useRef(null);
  const { language } = useLanguage();
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [cloudLoading, setCloudLoading] = useState(false);
  const [cloudError, setCloudError] = useState('');
  const [savedCVs, setSavedCVs] = useState([]);
  const [selectedCloudCVId, setSelectedCloudCVId] = useState(null);
  const [guestMode, setGuestMode] = useState(false);
  const {
    cvData,
    handleDataChange,
    handleAddResponsibility,
    handleRemoveResponsibility,
    handleAddExperience,
    handleRemoveExperience,
    handleAddEducation,
    handleRemoveEducation,
    handleRemoveEducationSection,
    handleAddCustomSkill,
    handleRemoveCustomSkill,
    handleRemoveSkillSection,
    handleMoveSkillSection,
    importCVData,
    mergeCVData,
  } = useCVData();

  const handlePdfExport = () => CVPdfExporter.exportToPdf(cvRef.current, cvData, language);

  const loadSavedCVs = async (userId) => {
    if (!supabase || !userId) return;
    const { data, error } = await supabase
      .from('cvs')
      .select('id, title, language, updated_at, created_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      setCloudError(error.message);
      return;
    }
    setSavedCVs(data || []);
    if (!selectedCloudCVId && data && data.length > 0) {
      setSelectedCloudCVId(data[0].id);
    }
  };

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const user = data.session?.user ?? null;
      setAuthUser(user);
      if (user?.id) {
        setGuestMode(false);
        loadSavedCVs(user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setAuthUser(user);
      if (user?.id) {
        setGuestMode(false);
        loadSavedCVs(user.id);
      } else {
        setSavedCVs([]);
        setSelectedCloudCVId(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const onEmailLogin = async (prefilledEmail = '') => {
    if (!supabase) return;
    const email = prefilledEmail || window.prompt('Enter your email to receive login link:') || '';
    if (!email) return;
    setAuthLoading(true);
    setCloudError('');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    setAuthLoading(false);
    if (error) {
      setCloudError(error.message);
      return;
    }
    window.alert('Magic link sent. Check your email.');
  };

  const onGoogleLogin = async () => {
    if (!supabase) return;
    setAuthLoading(true);
    setCloudError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    setAuthLoading(false);
    if (error) {
      setCloudError(error.message);
    }
  };

  const onLogout = async () => {
    if (!supabase) return;
    setAuthLoading(true);
    setCloudError('');
    const { error } = await supabase.auth.signOut();
    setAuthLoading(false);
    if (error) setCloudError(error.message);
  };

  const onSaveCurrentCV = async () => {
    if (!selectedCloudCVId) {
      setCloudError('Open a CV from cloud list first, or use "Save as new CV".');
      return;
    }
    if (!supabase || !authUser) return;
    setCloudLoading(true);
    setCloudError('');

    const payload = {
      title: cvData.name?.trim() ? `${cvData.name} CV` : 'My CV',
      language,
      cv_data: cvData,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('cvs')
      .update(payload)
      .eq('id', selectedCloudCVId)
      .eq('user_id', authUser.id);
    setCloudLoading(false);
    if (error) {
      setCloudError(error.message);
      return;
    }
    loadSavedCVs(authUser.id);
  };

  const onSaveAsNewCloudCV = async () => {
    if (!supabase || !authUser) return;
    setCloudLoading(true);
    setCloudError('');
    const payload = {
      user_id: authUser.id,
      title: cvData.name?.trim() ? `${cvData.name} CV` : 'My CV',
      language,
      cv_data: cvData,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('cvs').insert(payload).select('id').single();
    setCloudLoading(false);
    if (error) {
      setCloudError(error.message);
      return;
    }
    if (data?.id) {
      setSelectedCloudCVId(data.id);
    }
    loadSavedCVs(authUser.id);
  };

  const onLoadCloudCV = async (cvId) => {
    if (!supabase || !authUser) return;
    setCloudLoading(true);
    setCloudError('');
    const { data, error } = await supabase
      .from('cvs')
      .select('id, cv_data')
      .eq('id', cvId)
      .eq('user_id', authUser.id)
      .single();
    setCloudLoading(false);
    if (error) {
      setCloudError(error.message);
      return;
    }
    if (data?.cv_data) {
      setSelectedCloudCVId(cvId);
      importCVData(data.cv_data);
    }
  };

  const onDeleteCloudCV = async (cvId) => {
    if (!supabase || !authUser) return;
    setCloudLoading(true);
    setCloudError('');
    const { error } = await supabase
      .from('cvs')
      .delete()
      .eq('id', cvId)
      .eq('user_id', authUser.id);
    setCloudLoading(false);
    if (error) {
      setCloudError(error.message);
      return;
    }
    if (selectedCloudCVId === cvId) {
      setSelectedCloudCVId(null);
    }
    loadSavedCVs(authUser.id);
  };

  const onDuplicateCloudCV = async (cvId) => {
    if (!supabase || !authUser) return;
    setCloudLoading(true);
    setCloudError('');
    const { data, error } = await supabase
      .from('cvs')
      .select('title, language, cv_data')
      .eq('id', cvId)
      .eq('user_id', authUser.id)
      .single();
    if (error) {
      setCloudLoading(false);
      setCloudError(error.message);
      return;
    }
    const insertPayload = {
      user_id: authUser.id,
      title: `${data.title || 'My CV'} (Copy)`,
      language: data.language || language,
      cv_data: data.cv_data || cvData,
      updated_at: new Date().toISOString(),
    };
    const { data: inserted, error: insertError } = await supabase
      .from('cvs')
      .insert(insertPayload)
      .select('id')
      .single();
    setCloudLoading(false);
    if (insertError) {
      setCloudError(insertError.message);
      return;
    }
    if (inserted?.id) {
      setSelectedCloudCVId(inserted.id);
    }
    loadSavedCVs(authUser.id);
  };

  if (!authUser && !guestMode) {
    return (
      <AuthScreen
        authLoading={authLoading}
        cloudError={cloudError}
        onEmailLogin={onEmailLogin}
        onGoogleLogin={onGoogleLogin}
        onContinueWithoutAccount={() => setGuestMode(true)}
        supabaseConfigured={isSupabaseConfigured}
      />
    );
  }


  return (
    <div className="flex flex-col lg:flex-row h-screen p-4 bg-gray-100 font-sans">
      <CVBuilderLayout
        cvData={cvData}
        handleDataChange={handleDataChange}
        handleAddResponsibility={handleAddResponsibility}
        handleRemoveResponsibility={handleRemoveResponsibility}
        handleAddExperience={handleAddExperience}
        handleRemoveExperience={handleRemoveExperience}
        handleAddEducation={handleAddEducation}
        handleRemoveEducation={handleRemoveEducation}
        handleAddCustomSkill={handleAddCustomSkill}
        handleRemoveCustomSkill={handleRemoveCustomSkill}
        handlePdfExport={handlePdfExport}
        importCVData={importCVData}
        mergeCVData={mergeCVData}
        authUser={authUser}
        authLoading={authLoading}
        cloudLoading={cloudLoading}
        cloudError={cloudError}
        savedCVs={savedCVs}
        onEmailLogin={onEmailLogin}
        onGoogleLogin={onGoogleLogin}
        onLogout={onLogout}
        onSaveCurrentCV={onSaveCurrentCV}
        onSaveAsNewCloudCV={onSaveAsNewCloudCV}
        onLoadCloudCV={onLoadCloudCV}
        onDeleteCloudCV={onDeleteCloudCV}
        onDuplicateCloudCV={onDuplicateCloudCV}
        selectedCloudCVId={selectedCloudCVId}
        supabaseConfigured={isSupabaseConfigured}
      />
      <PreviewContainer cvData={cvData} cvRef={cvRef} />
    </div>
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
