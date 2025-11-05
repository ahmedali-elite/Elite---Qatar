import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Download, ArrowLeft, Phone, FileText, Lightbulb, Brain, User, Calendar, BarChart2, PieChart, Check, ThumbsUp, ThumbsDown, ShieldCheck, Loader2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Legend, Line, Pie, Cell } from 'recharts';
import type { SummaryData, GamificationData, UserData } from '../types';
import SocialIcons from './SocialIcons';
import PrintablePlan from './PrintablePlan';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../i18n/LanguageContext';
import { getFullJourneySummary } from '../services/geminiService';

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
};

// FIX: Wrap in React.memo to ensure it's treated as a component, resolving prop type errors for `key`.
const SkeletonLoader = React.memo(({ className = '', message }: { className?: string, message: string }) => (
    <div className={`w-full h-full bg-gray-200/50 rounded-2xl animate-pulse flex items-center justify-center p-6 ${className}`}>
        <div className="text-center text-gray-500">
            <Loader2 className="w-8 h-8 mx-auto animate-spin mb-3" />
            <p className="font-semibold">{message}</p>
        </div>
    </div>
));

// FIX: Wrap in React.memo to ensure it's treated as a component, resolving prop type errors for `children`.
const DashboardPanel = React.memo(({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <motion.div variants={itemVariants} className={`bg-white border border-gray-200/80 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}>
        {children}
    </motion.div>
));

const AnimatedIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <Icon className="w-7 h-7" />
    </motion.div>
);

const SwotItem = ({ icon: Icon, title, items, color }: { icon: React.ElementType, title: string, items: string[], color: string }) => (
    <div className={`p-4 rounded-lg bg-${color}/10`}>
        <h4 className={`font-bold text-lg mb-2 flex items-center gap-2 text-${color}`}>
            <Icon className="w-5 h-5" /> {title}
        </h4>
        <ul className="space-y-1 list-none pl-2">
            {items.map((item, index) => (
                <li key={index} className="text-gray-600 text-sm flex items-start">
                    <span className={`mr-2 mt-1 text-${color}`}>&#8226;</span>{item}
                </li>
            ))}
        </ul>
    </div>
);

const BudgetChart = ({ data }: { data: SummaryData['budgetAllocation'] }) => {
    const COLORS = ['#a9ce17', '#8aa410', '#4a5568', '#718096', '#a0aec0'];
    return (
         <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie data={data} dataKey="percentage" nameKey="channel" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                    {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    )
};

const KpiChart = ({ data }: { data: SummaryData['kpiProjections'] }) => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data[0]?.data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" name={data[0]?.name} stroke="#a9ce17" strokeWidth={3} />
        </LineChart>
    </ResponsiveContainer>
);

interface SummaryStepProps {
  gamificationData: GamificationData;
  userData: UserData;
  onPrevious: () => void;
  onBook: () => void;
  onSummaryLoaded: (data: SummaryData) => void;
}

const SummaryStep = ({ gamificationData, userData, onPrevious, onBook, onSummaryLoaded }: SummaryStepProps) => {
  const { t, language } = useLanguage();
  const [summaryData, setSummaryData] = useState<Partial<SummaryData> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);
  const [activeGoalTab, setActiveGoalTab] = useState(0);

  useEffect(() => {
    // This component now fetches its own data.
    const handleUpdate = (data: Partial<SummaryData>) => {
        setSummaryData(prev => ({ ...prev, ...data }));
    };
    const handleError = (err: Error) => {
        setError(err.message);
    };

    const translatedUserData = {
        ...userData,
        industry: t(`constants.industries.${userData.industry}`),
        subIndustry: t(`constants.sub_industries.${userData.subIndustry}`),
        companySize: t(`constants.company_sizes.${userData.companySize}`),
        // FIX: Corrected a syntax error where the map function for `goals` was not properly closed, causing a compilation error for the `challenges` property.
        goals: userData.goals.map(id => t(`constants.goals.${id}`)),
        challenges: userData.challenges.map(id => t(`constants.challenges.${id}`)),
        platforms: userData.platforms.map(id => t(`constants.platforms.${id}`)),
    };
    
    getFullJourneySummary(translatedUserData, language, handleUpdate, handleError);
  }, [userData, language, t]);

  useEffect(() => {
    if (
      summaryData &&
      summaryData.executiveSummary &&
      summaryData.goalRecommendations &&
      summaryData.swotAnalysis &&
      summaryData.customerPersona &&
      summaryData.timeline &&
      summaryData.kpiProjections &&
      summaryData.budgetAllocation &&
      summaryData.gamification
    ) {
      onSummaryLoaded(summaryData as SummaryData);
    }
  }, [summaryData, onSummaryLoaded]);


  const handleDownload = async () => {
    if (!printableRef.current || !summaryData?.executiveSummary) return; // Only allow download if data is complete
    setIsDownloading(true);
    try {
        const canvas = await html2canvas(printableRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        let heightLeft = imgHeight - pdf.internal.pageSize.getHeight();
        while (heightLeft > 0) {
          position = -heightLeft;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }
        pdf.save(`Strategic-Plan-${userData.name}.pdf`);
    } catch (e) { console.error("Error generating PDF:", e); }
    finally { setIsDownloading(false); }
  };
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const gamificationTitle = summaryData?.gamification?.title || gamificationData.title;
  const gamificationBadgeIcon = summaryData?.gamification?.badgeIcon || '💡';

  return (
    <>
      <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
          {summaryData?.executiveSummary && (
             <PrintablePlan ref={printableRef} summaryData={summaryData as SummaryData} gamificationData={{...gamificationData, title: gamificationTitle}} userData={userData} lang={language} />
          )}
      </div>
      <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 animate-fade-in bg-brand-gray pt-28 pb-12">
          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="text-center mb-12">
              <span className="text-5xl md:text-6xl">{gamificationBadgeIcon}</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-gray-900">{t('summary.title')}</h1>
              <h2 className="text-xl sm:text-2xl font-semibold mt-2 text-gray-700">{t('summary.subtitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-dark to-brand-green">{gamificationTitle}</span></h2>
          </motion.div>

          {error && (
              <div className="w-full max-w-7xl p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                  <h3 className="font-bold text-xl mb-2">{t('summary.criticalError')}</h3>
                  <p className="font-mono text-sm">{error}</p>
              </div>
          )}

          <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
          >
              <DashboardPanel className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                      {summaryData?.executiveSummary ? (
                          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={FileText} /> {t('summary.executiveSummary')}</h3>
                              <p className="text-gray-600 leading-relaxed text-base md:text-lg">{summaryData.executiveSummary}</p>
                          </motion.div>
                      ) : (
                          <SkeletonLoader key="skeleton" message={t('loading.live.summary')} />
                      )}
                  </AnimatePresence>
              </DashboardPanel>
              
               <DashboardPanel className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                      {summaryData?.goalRecommendations ? (
                          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                              <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={Lightbulb} /> {t('summary.recommendations')}</h3>
                              <div className="flex border-b border-gray-200 overflow-x-auto">
                                  {summaryData.goalRecommendations.map((rec, index) => (
                                      <button key={index} onClick={() => setActiveGoalTab(index)} className={`px-3 py-2 sm:px-4 sm:py-3 font-semibold text-base md:text-lg transition-colors duration-300 whitespace-nowrap ${activeGoalTab === index ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-800'}`}>
                                          {rec.goal}
                                      </button>
                                  ))}
                              </div>
                              <AnimatePresence mode="wait">
                                  <motion.div key={activeGoalTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-6">
                                      <ul className="space-y-3">
                                         {summaryData.goalRecommendations[activeGoalTab]?.recommendations.map((item, i) => (
                                              <li key={i} className="flex items-start space-x-3 text-gray-700 text-base md:text-lg">
                                                 <Check className="w-6 h-6 text-brand-green mt-1 flex-shrink-0" />
                                                 <span>{item}</span>
                                              </li>
                                          ))}
                                      </ul>
                                  </motion.div>
                              </AnimatePresence>
                          </motion.div>
                      ) : (
                          <SkeletonLoader key="skeleton" message={t('loading.live.recommendations')} />
                      )}
                  </AnimatePresence>
               </DashboardPanel>
              
               <DashboardPanel className="lg:col-span-3">
                   <AnimatePresence mode="wait">
                       {summaryData?.timeline ? (
                            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={Calendar} /> {t('summary.roadmap')}</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {summaryData.timeline.map((item) => (
                                        <div key={item.quarter} className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-bold text-lg text-gray-800">{item.quarter}</h4>
                                            <p className="font-semibold text-brand-green-dark my-1">{item.focus}</p>
                                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
                                                {item.keyActions.map((action, i) => <li key={i}>{action}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <SkeletonLoader key="skeleton" message={t('loading.live.roadmap')} />
                        )}
                   </AnimatePresence>
                </DashboardPanel>


              <DashboardPanel className="lg:col-span-2">
                   <AnimatePresence mode="wait">
                        {summaryData?.kpiProjections ? (
                            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={BarChart2} /> {t('summary.kpi')}</h3>
                                <KpiChart data={summaryData.kpiProjections} />
                           </motion.div>
                        ) : (
                            <SkeletonLoader key="skeleton" message={t('loading.live.kpi')} />
                        )}
                    </AnimatePresence>
              </DashboardPanel>

               <DashboardPanel className="lg:col-span-1">
                   <AnimatePresence mode="wait">
                        {summaryData?.budgetAllocation ? (
                             <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={PieChart} /> {t('summary.budget')}</h3>
                                <BudgetChart data={summaryData.budgetAllocation} />
                             </motion.div>
                         ) : (
                             <SkeletonLoader key="skeleton" message={t('loading.live.budget')} />
                         )}
                    </AnimatePresence>
              </DashboardPanel>

               <DashboardPanel className="lg:col-span-2">
                   <AnimatePresence mode="wait">
                        {summaryData?.swotAnalysis ? (
                            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={Brain} /> {t('summary.swot')}</h3>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <SwotItem icon={ThumbsUp} title={t('summary.strengths')} items={summaryData.swotAnalysis.strengths} color="green-500" />
                                    <SwotItem icon={ThumbsDown} title={t('summary.weaknesses')} items={summaryData.swotAnalysis.weaknesses} color="red-500" />
                                    <SwotItem icon={Lightbulb} title={t('summary.opportunities')} items={summaryData.swotAnalysis.opportunities} color="blue-500" />
                                    <SwotItem icon={ShieldCheck} title={t('summary.threats')} items={summaryData.swotAnalysis.threats} color="yellow-500" />
                                </div>
                            </motion.div>
                        ) : (
                            <SkeletonLoader key="skeleton" message={t('loading.live.swot')} />
                        )}
                    </AnimatePresence>
              </DashboardPanel>

              <DashboardPanel className="lg:col-span-1">
                  <AnimatePresence mode="wait">
                        {summaryData?.customerPersona ? (
                             <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                  <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={User} /> {t('summary.persona')}</h3>
                                  <div className="bg-brand-gray p-4 sm:p-6 rounded-lg h-full flex flex-col justify-between">
                                      <div>
                                          <div className="flex items-center gap-4 mb-4">
                                              <div className="bg-brand-green/20 p-3 rounded-full">
                                                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-brand-green-dark" />
                                              </div>
                                              <div>
                                                  <h4 className="text-xl sm:text-2xl font-bold text-brand-green-dark">{summaryData.customerPersona.name}</h4>
                                                  <p className="text-xs sm:text-sm text-gray-500">{summaryData.customerPersona.demographics}</p>
                                              </div>
                                          </div>
                                          <div className="mb-4">
                                              <p className="font-semibold text-gray-700 text-base md:text-lg">{t('summary.personaGoals')}</p>
                                              <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm sm:text-base">
                                                  {summaryData.customerPersona.goals.map((goal, i) => <li key={i}>{goal}</li>)}
                                              </ul>
                                          </div>
                                          <div>
                                              <p className="font-semibold text-gray-700 text-base md:text-lg">{t('summary.personaPainPoints')}</p>
                                              <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm sm:text-base">
                                                  {summaryData.customerPersona.painPoints.map((pp, i) => <li key={i}>{pp}</li>)}
                                              </ul>
                                          </div>
                                      </div>
                                  </div>
                              </motion.div>
                        ) : (
                            <SkeletonLoader key="skeleton" message={t('loading.live.persona')} />
                        )}
                  </AnimatePresence>
              </DashboardPanel>

              <motion.div variants={itemVariants} className="lg:col-span-3 text-center pt-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{t('summary.readyTitle')}</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-base md:text-lg">{t('summary.readySubtitle')}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <motion.button onClick={onPrevious} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-full shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
                          <ArrowLeft /> {t('summary.editButton')}
                      </motion.button>
                      <motion.button onClick={handleDownload} disabled={isDownloading || !summaryData?.executiveSummary} whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(169, 206, 23, 0.4)' }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-brand-green text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto">
                          {isDownloading ? <><Loader2 className="animate-spin" /> {t('summary.generatingPDF')}</> : <><Download /> {t('summary.downloadButton')}</>}
                      </motion.button>
                      <motion.button
                        onClick={onBook}
                        disabled={!summaryData?.executiveSummary}
                        whileHover={!summaryData?.executiveSummary ? {} : { scale: 1.05, boxShadow: '0 0 25px rgba(138, 164, 16, 0.5)' }}
                        whileTap={!summaryData?.executiveSummary ? {} : { scale: 0.95 }}
                        className="px-8 py-4 text-lg bg-brand-green-dark text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <Phone /> {t('summary.bookButton')}
                      </motion.button>
                  </div>
                   <div className="mt-12">
                    <SocialIcons />
                  </div>
              </motion.div>
          </motion.div>
      </div>
    </>
  );
};

export default SummaryStep;