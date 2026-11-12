export interface TechGuide {
  id: string;
  title: string;
  category: 'Windows' | 'Network & WiFi' | 'Android' | 'Web & SEO';
  readTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Advanced';
  updatedAt: string;
  summary: string;
  steps: {
    stepNumber: string;
    title: string;
    explanation: string;
    codeSnippet?: string;
    codeLanguage?: string;
  }[];
  keyTakeaway: string;
}

export const TECH_GUIDES: TechGuide[] = [
  {
    id: 'windows-debloat-performance',
    title: 'Windows 11 Latency & Telemetry Purge: Step-by-Step Optimization',
    category: 'Windows',
    readTime: '6 min read',
    difficulty: 'Easy',
    updatedAt: 'October 2026',
    summary: 'Reclaim 3.5GB+ of system memory and reduce input latency by eliminating background diagnostic telemetry, consumer bloatware, and unnecessary background services.',
    steps: [
      {
        stepNumber: '01',
        title: 'Open Elevated PowerShell Console',
        explanation: 'Press Windows Key + X and select "Terminal (Admin)" or "Windows PowerShell (Admin)" to launch with system administrative permissions.',
        codeSnippet: '# Verify administrative execution privileges\n[Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()',
        codeLanguage: 'powershell'
      },
      {
        stepNumber: '02',
        title: 'Disable Diagnostic Telemetry & Advertising IDs',
        explanation: 'Stop continuous logging to Microsoft servers to preserve CPU cycles and SSD write endurance.',
        codeSnippet: 'Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" -Name "AllowTelemetry" -Type DWord -Value 0\nStop-Service "DiagTrack" -WarningAction SilentlyContinue\nSet-Service "DiagTrack" -StartupType Disabled',
        codeLanguage: 'powershell'
      },
      {
        stepNumber: '03',
        title: 'Clear Temporary Cache & Prefetch Bloat',
        explanation: 'Remove stale installer caches and leftover Windows update download temp files safely.',
        codeSnippet: 'Clear-RecycleBin -Force -ErrorAction SilentlyContinue\nRemove-Item -Path "$env:TEMP\\*" -Recurse -Force -ErrorAction SilentlyContinue',
        codeLanguage: 'powershell'
      },
      {
        stepNumber: '04',
        title: 'Optimize Power Plan for Maximum Clock Stability',
        explanation: 'Enable the Ultimate Performance power scheme to prevent CPU core parking during high-intensity creative work.',
        codeSnippet: 'powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61',
        codeLanguage: 'powershell'
      }
    ],
    keyTakeaway: 'Reboot after applying these settings. You should notice a 30-40% reduction in idle RAM usage and noticeably snappier window switching.'
  },
  {
    id: 'wifi-jitter-packetloss-fix',
    title: 'Home Office & Studio WiFi Optimization: Eliminating Packet Loss & Jitter',
    category: 'Network & WiFi',
    readTime: '5 min read',
    difficulty: 'Moderate',
    updatedAt: 'October 2026',
    summary: 'A structured troubleshooting protocol to identify channel congestion, DNS bottlenecking, and bufferbloat for lag-free video calls and uploads.',
    steps: [
      {
        stepNumber: '01',
        title: 'Audit Surrounding Channel Interference',
        explanation: 'Most modern routers default to auto channels that overlap with neighbors. Inspect nearby networks using the native Windows netsh utility.',
        codeSnippet: 'netsh wlan show networks mode=bssid',
        codeLanguage: 'powershell'
      },
      {
        stepNumber: '02',
        title: 'Switch to Low-Latency Anycast DNS',
        explanation: 'Replace slow ISP resolvers with Cloudflare 1.1.1.1 or Google 8.8.8.8 with encrypted DNS-over-HTTPS.',
        codeSnippet: '# Set Cloudflare DNS for primary Wi-Fi adapter\nnetsh interface ipv4 set dnsservers "Wi-Fi" static 1.1.1.1 primary\nnetsh interface ipv4 add dnsservers "Wi-Fi" 1.0.0.1 index=2',
        codeLanguage: 'powershell'
      },
      {
        stepNumber: '03',
        title: 'Flush Stale DNS Cache & Reset TCP/IP Stack',
        explanation: 'Clears corrupted routing tables and stale host lookups that cause random page timeouts.',
        codeSnippet: 'ipconfig /flushdns\nnetsh winsock reset\nnetsh int ip reset',
        codeLanguage: 'powershell'
      }
    ],
    keyTakeaway: 'Always prioritize the 5GHz or 6GHz band for your workstation, reserving the 2.4GHz band exclusively for low-bandwidth smart home IoT devices.'
  },
  {
    id: 'android-speedup-battery-guide',
    title: 'Android Deep Optimization: Eliminating Lag & Extending Daily Battery Life',
    category: 'Android',
    readTime: '4 min read',
    difficulty: 'Easy',
    updatedAt: 'October 2026',
    summary: 'Fine-tune Android system animations, background process limitations, and RAM expansion features without voiding your warranty.',
    steps: [
      {
        stepNumber: '01',
        title: 'Enable Developer Options',
        explanation: 'Go to Settings > About Phone > Tap "Build Number" 7 consecutive times until "You are now a developer!" appears.'
      },
      {
        stepNumber: '02',
        title: 'Speed Up System UI Animation Scales',
        explanation: 'In Developer Options, locate Window Animation Scale, Transition Animation Scale, and Animator Duration Scale. Change all three from 1.0x to 0.5x. Your phone will immediately feel twice as responsive.'
      },
      {
        stepNumber: '03',
        title: 'Disable Virtual RAM / RAM Plus',
        explanation: 'Virtual RAM uses your phone internal flash storage as swap memory. Since flash memory is 10x slower than real LPDDR5 RAM, this often causes micro-stuttering. Turn off "RAM Plus" or "Memory Extension" in Device Care.'
      },
      {
        stepNumber: '04',
        title: 'Deep Sleep Inactive Background Apps',
        explanation: 'Put apps you use infrequently (shopping apps, travel apps) into Deep Sleep. They will never run in the background or drain battery until explicitly opened.'
      }
    ],
    keyTakeaway: 'Avoid third-party cleaner or battery booster apps—they consume more power than the apps they claim to hibernate.'
  },
  {
    id: 'legacy-modern-migration-roadmap',
    title: 'Migrating Legacy Web Architectures to High-Performance React & Vite',
    category: 'Web & SEO',
    readTime: '7 min read',
    difficulty: 'Advanced',
    updatedAt: 'October 2026',
    summary: 'The technical blueprint behind migrating legacy websites to modern React/Vite with zero ranking loss and instant sub-100ms load times.',
    steps: [
      {
        stepNumber: '01',
        title: 'Export Full Content & Asset Archive',
        explanation: 'In your existing CMS admin dashboard, navigate to Settings > Export Content. Download your archive containing all posts, products, and media metadata.'
      },
      {
        stepNumber: '02',
        title: 'Map Permalinks & Preserve URL Slugs',
        explanation: 'Legacy URLs often contain nested date structures. Set up clean redirect rules or routing rewrites to ensure legacy links maintain 100% SEO authority.',
        codeSnippet: '// Clean route rewrite for legacy URL formats\nexport function resolveLegacyUrlSlug(url: string) {\n  const match = url.match(/\\/\\d{4}\\/\\d{2}\\/([^.]+)\\.html/);\n  return match ? `/guides/${match[1]}` : url;\n}',
        codeLanguage: 'typescript'
      },
      {
        stepNumber: '03',
        title: 'Adopt Modern Responsive Layout & Semantic Structured Data',
        explanation: 'Replace slow monolithic templates with modern React components, Tailwind styling, and Schema.org Article/Product JSON-LD for rich Google search snippets.'
      }
    ],
    keyTakeaway: 'Upgrading your platform transforms bounce rate into loyal subscribers and customers. Modern responsive design builds instant buyer trust.'
  }
];
