import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CharityCause {
  id: string;
  name: string;
  shortLabel: string;
  category: string;
  description: string;
  impactGoal: string;
  iconName: string;
}

export const CHARITY_CAUSES: CharityCause[] = [
  {
    id: 'clean-water',
    name: 'Clean Water & Sanitation Initiative',
    shortLabel: 'Clean Water',
    category: 'Water & Sanitation',
    description: 'Funding solar-powered water wells and filtration systems for rural communities facing clean water scarcity.',
    impactGoal: '1 well provides clean water to 350+ people for 10+ years',
    iconName: 'Droplets'
  },
  {
    id: 'education',
    name: "Children's Education & Tech Literacy",
    shortLabel: 'Education',
    category: 'Education & Tech',
    description: 'Providing coding kits, refurbished laptops, and textbooks for underprivileged youth and schools.',
    impactGoal: 'Supplying educational resources to 1,200+ students annually',
    iconName: 'BookOpen'
  },
  {
    id: 'hunger',
    name: 'Global Hunger & Emergency Food Relief',
    shortLabel: 'Food Relief',
    category: 'Food & Relief',
    description: 'Providing nutritious meal packages, food banks, and rapid emergency food distribution in disaster zones.',
    impactGoal: 'Over 25,000 emergency meals delivered to families',
    iconName: 'HeartHandshake'
  },
  {
    id: 'medical',
    name: 'Essential Healthcare & Medical Aid',
    shortLabel: 'Healthcare',
    category: 'Healthcare',
    description: 'Supplying basic antibiotics, first-aid equipment, and maternal healthcare to underserved rural clinics.',
    impactGoal: 'Supporting community health centers with vital medical kits',
    iconName: 'Activity'
  }
];

interface CharityContextType {
  charityEnabled: boolean;
  setCharityEnabled: (enabled: boolean) => void;
  toggleCharityEnabled: () => void;
  selectedCauseId: string;
  setSelectedCauseId: (id: string) => void;
  selectedCause: CharityCause;
  causes: CharityCause[];
  isCharityModalOpen: boolean;
  setIsCharityModalOpen: (open: boolean) => void;
  pledgePercentage: number;
}

const CharityContext = createContext<CharityContextType | undefined>(undefined);

export const CharityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [charityEnabled, setCharityEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mrs_charity_enabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [selectedCauseId, setSelectedCauseIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('mrs_charity_cause');
      return saved || 'clean-water';
    } catch {
      return 'clean-water';
    }
  });

  const [isCharityModalOpen, setIsCharityModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('mrs_charity_enabled', JSON.stringify(charityEnabled));
    } catch {
      // storage unavailable
    }
  }, [charityEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('mrs_charity_cause', selectedCauseId);
    } catch {
      // storage unavailable
    }
  }, [selectedCauseId]);

  const toggleCharityEnabled = () => {
    setCharityEnabledState((prev) => !prev);
  };

  const setCharityEnabled = (enabled: boolean) => {
    setCharityEnabledState(enabled);
  };

  const setSelectedCauseId = (id: string) => {
    setSelectedCauseIdState(id);
  };

  const selectedCause =
    CHARITY_CAUSES.find((c) => c.id === selectedCauseId) || CHARITY_CAUSES[0];

  return (
    <CharityContext.Provider
      value={{
        charityEnabled,
        setCharityEnabled,
        toggleCharityEnabled,
        selectedCauseId,
        setSelectedCauseId,
        selectedCause,
        causes: CHARITY_CAUSES,
        isCharityModalOpen,
        setIsCharityModalOpen,
        pledgePercentage: 5
      }}
    >
      {children}
    </CharityContext.Provider>
  );
};

export const useCharity = () => {
  const context = useContext(CharityContext);
  if (!context) {
    throw new Error('useCharity must be used within a CharityProvider');
  }
  return context;
};
