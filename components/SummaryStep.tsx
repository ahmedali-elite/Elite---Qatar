import React, { useState, useRef } from 'react';
// FIX: Removed Variants from import as it's not exported in the version of framer-motion being used.
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Download, ArrowLeft, Share2, FileText, CalendarClock, Trophy, Phone, PieChart as PieChartIcon, Target, Lock, Loader2, User, Brain, Lightbulb, ShieldCheck, ThumbsDown, ThumbsUp, BrainCircuit, BarChart3 } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, Legend } from 'recharts';
import type { SummaryData, GamificationData, UserData } from '../types';
import SocialIcons from './SocialIcons';
import PrintablePlan from './PrintablePlan';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../i18n/LanguageContext';

interface SummaryStepProps {
  summaryData: SummaryData | null;
  gamificationData: GamificationData;
  userData: UserData;
  onPrevious: () => void;
  onBook: () => void;
}

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
const AnimatedIcon = ({ icon: Icon }: { icon: React.ElementType }) => (
    <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <Icon className="w-7 h-7" />
    </motion.div>
);

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
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

// FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
const SummaryStep = ({ summaryData, gamificationData, userData, onPrevious, onBook }: SummaryStepProps) => {
  const { t, language } = useLanguage();
  const [isDownloading, setIsDownloading] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);
  const [activeGoalTab, setActiveGoalTab] = useState(0);


  const handleDownload = async () => {
    if (!printableRef.current) return;
    setIsDownloading(true);
    try {
        const canvas = await html2canvas(printableRef.current, {
            scale: 2, 
            backgroundColor: '#ffffff',
            useCORS: true,
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save(`Strategic-Plan-${userData.name}.pdf`);
    } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Sorry, there was an error generating the PDF. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };
  
  if (!summaryData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p>No summary data available.</p>
      </div>
    );
  }

  const { executiveSummary, timeline, kpiProjections, gamification, focusAreas, budgetAllocation, swotAnalysis, customerPersona, goalRecommendations, challengesAnalysis } = summaryData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  // FIX: Removed explicit Variants type
  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: { y: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  };

  // FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
  const DashboardPanel = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <motion.div variants={itemVariants} className={`bg-white border border-gray-200/80 p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}>
        {children}
    </motion.div>
  );

  // FIX: Removed React.FC to resolve potential type conflicts with framer-motion.
  const BlurredOverlay = ({ onUnlock }: { onUnlock: () => void }) => (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center text-center p-4 rounded-2xl z-10">
        <Lock className="w-10 h-10 md:w-12 md:h-12 text-brand-green-dark mb-4" />
        <h4 className="font-bold text-lg md:text-xl text-gray-800">{t('summary.unlockTitle')}</h4>
        <p className="text-gray-600 mb-4 text-sm md:text-base">{t('summary.unlockSubtitle')}</p>
        <motion.button 
            onClick={onUnlock}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-brand-green-dark text-white font-semibold rounded-full shadow-md text-sm md:text-base"
        >
            {t('summary.unlockButton')}
        </motion.button>
    </div>
  );

  return (
    <>
      <div style={{ position: 'absolute', left: '-9999px', top: 0, zIndex: -1 }}>
          <PrintablePlan ref={printableRef} summaryData={summaryData} gamificationData={gamificationData} userData={userData} lang={language} />
      </div>
      <div className="min-h-screen w-full flex flex-col items-center p-4 sm:p-6 md:p-8 animate-fade-in bg-brand-gray pt-28 pb-12">
          <motion.div variants={itemVariants} initial="hidden" animate="visible" className="text-center mb-12">
              <span className="text-5xl md:text-6xl">{gamification.badgeIcon}</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-gray-900">{t('summary.title')}</h1>
              <h2 className="text-xl sm:text-2xl font-semibold mt-2 text-gray-700">{t('summary.subtitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green-dark to-brand-green">{gamification.title}</span></h2>
          </motion.div>

          <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6"
          >
              <DashboardPanel className="lg:col-span-3">
                  <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={FileText} /> {t('summary.executiveSummary')}</h3>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg">{executiveSummary}</p>
              </DashboardPanel>
              
               <DashboardPanel className="lg:col-span-3">
                <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={Lightbulb} /> {t('summary.recommendations')}</h3>
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {goalRecommendations.map((rec, index) => (
                        <button 
                            key={index} 
                            onClick={() => setActiveGoalTab(index)}
                            className={`px-3 py-2 sm:px-4 sm:py-3 font-semibold text-base md:text-lg transition-colors duration-300 whitespace-nowrap ${activeGoalTab === index ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            {rec.goal}
                        </button>
                    ))}
                </div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeGoalTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6"
                    >
                        <ul className="space-y-3">
                           {goalRecommendations[activeGoalTab]?.recommendations.map((item, i) => (
                                <li key={i} className="flex items-start space-x-3 text-gray-700 text-base md:text-lg">
                                   <Check className="w-6 h-6 text-brand-green mt-1 flex-shrink-0" />
                                   <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </AnimatePresence>
              </DashboardPanel>

              <DashboardPanel className="lg:col-span-3">
                  <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={CalendarClock} /> {t('summary.roadmap')}</h3>
                  <div className="w-full space-y-6 mt-4">
                      {timeline.map((item, index) => (
                          <div key={index} className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-lg bg-brand-gray border border-gray-200">
                              <div className="flex-shrink-0 w-full sm:w-48 text-left sm:text-right">
                                  <h4 className="text-lg sm:text-xl font-semibold text-brand-green-dark">{item.quarter}</h4>
                                  <p className="text-gray-600 font-medium">{item.focus}</p>
                              </div>
                              <div className="w-px bg-gray-300 self-stretch hidden sm:block"></div>
                              <ul className="list-none space-y-2 flex-grow">
                                  {item.milestones.map((milestone, i) => (
                                      <li key={i} className="flex items-start text-gray-700 text-sm sm:text-base">
                                          <Check className="w-5 h-5 mr-3 text-brand-green flex-shrink-0 mt-1" /> {milestone}
                                      </li>
                                  ))}
                              </ul>
                          </div>
                      ))}
                  </div>
              </DashboardPanel>
              
               <DashboardPanel className="lg:col-span-2">
                <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={Brain} /> {t('summary.swot')}</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SwotItem icon={ThumbsUp} title={t('summary.strengths')} items={swotAnalysis.strengths} color="green-500" />
                    <SwotItem icon={ThumbsDown} title={t('summary.weaknesses')} items={swotAnalysis.weaknesses} color="red-500" />
                    <SwotItem icon={Lightbulb} title={t('summary.opportunities')} items={swotAnalysis.opportunities} color="blue-500" />
                    <SwotItem icon={ShieldCheck} title={t('summary.threats')} items={swotAnalysis.threats} color="yellow-500" />
                </div>
              </DashboardPanel>

              <DashboardPanel className="lg:col-span-1">
                  <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={User} /> {t('summary.persona')}</h3>
                  <div className="bg-brand-gray p-4 sm:p-6 rounded-lg h-full flex flex-col justify-between">
                      <div>
                          <div className="flex items-center gap-4 mb-4">
                              <div className="bg-brand-green/20 p-3 rounded-full">
                                  <User className="w-6 h-6 sm:w-8 sm:h-8 text-brand-green-dark" />
                              </div>
                              <div>
                                  <h4 className="text-xl sm:text-2xl font-bold text-brand-green-dark">{customerPersona.name}</h4>
                                  <p className="text-xs sm:text-sm text-gray-500">{customerPersona.demographics}</p>
                              </div>
                          </div>
                          <div className="mb-4">
                              <p className="font-semibold text-gray-700 text-base md:text-lg">{t('summary.personaGoals')}</p>
                              <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm sm:text-base">
                                  {customerPersona.goals.map((goal, i) => <li key={i}>{goal}</li>)}
                              </ul>
                          </div>
                          <div>
                              <p className="font-semibold text-gray-700 text-base md:text-lg">{t('summary.personaPainPoints')}</p>
                              <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm sm:text-base">
                                  {customerPersona.painPoints.map((pp, i) => <li key={i}>{pp}</li>)}
                              </ul>
                          </div>
                      </div>
                  </div>
              </DashboardPanel>
              
              <DashboardPanel className="lg:col-span-2 relative">
                  <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={BrainCircuit} /> {t('summary.challengesAnalysis')}</h3>
                  <div className="relative mt-4">
                      <p className="text-gray-600 text-sm md:text-base mb-4">{challengesAnalysis.summary}</p>
                      <div style={{ width: '100%', height: 200 }}>
                          <ResponsiveContainer>
                              <RechartsBarChart data={challengesAnalysis.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                  <XAxis dataKey="name" stroke="#6b7280" />
                                  <YAxis stroke="#6b7280" />
                                  <Bar dataKey="impact" name="Impact Score" fill="#a9ce17" />
                              </RechartsBarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              </DashboardPanel>
              
              <DashboardPanel className="lg:col-span-1 relative">
                <h3 className="text-xl md:text-2xl font-bold text-brand-green mb-4 flex items-center gap-3"><AnimatedIcon icon={PieChartIcon} /> {t('summary.budget')}</h3>
                <div className="relative mt-4">
                     <div style={{ width: '100%', height: 250 }}>
                        {budgetAllocation && budgetAllocation.length > 0 ? (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie 
                                        isAnimationActive={false}
                                        data={budgetAllocation as any}
                                        cx="50%" 
                                        cy="50%" 
                                        outerRadius="80%" 
                                        fill="#8884d8" 
                                        dataKey="value" 
                                        nameKey="name" 
                                    >
                                        {budgetAllocation.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                <p>{t('summary.noBudgetData')}</p>
                            </div>
                        )}
                    </div>
                </div>
              </DashboardPanel>

              <motion.div variants={itemVariants} className="lg:col-span-3 text-center pt-8">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">{t('summary.readyTitle')}</h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-base md:text-lg">{t('summary.readySubtitle')}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <motion.button onClick={onPrevious} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-full shadow-md flex items-center justify-center gap-2 w-full sm:w-auto">
                          <ArrowLeft /> {t('summary.editButton')}
                      </motion.button>
                      <motion.button onClick={handleDownload} disabled={isDownloading} whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(169, 206, 23, 0.4)' }} whileTap={{ scale: 0.95 }} className="px-6 py-3 bg-brand-green text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-wait w-full sm:w-auto">
                          {isDownloading ? <><Loader2 className="animate-spin" /> {t('summary.generatingPDF')}</> : <><Download /> {t('summary.downloadButton')}</>}
                      </motion.button>
                      <motion.button onClick={onBook} whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(138, 164, 16, 0.5)' }} whileTap={{ scale: 0.95 }} className="px-8 py-4 text-lg bg-brand-green-dark text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">
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