# Agent registry
# Maintained by: HR Manager
# Last updated: 2026-06-01
# Format: Name | Department | Directory | Reports to | Status

## Executive
| Agent | Department | Directory | Reports to | Status |
|-------|-----------|-----------|------------|--------|
| Chief of Staff | Executive | agents/chief_of_staff/ | Atharva (Owner) | Active |
| Guide and Explainer | Executive | agents/guide_explainer/ | Atharva (Owner) | Active |

## HR
| Agent | Department | Directory | Reports to | Status |
|-------|-----------|-----------|------------|--------|
| HR Manager | HR | agents/hr/hr_manager/ | Chief of Staff | Active |
| Agent Performance Manager | HR | agents/hr/agent_performance/ | HR Manager | Active |
| Org Designer | HR | agents/hr/org_designer/ | HR Manager | Active |
| Knowledge Manager | HR | agents/hr/knowledge_manager/ | HR Manager | Active |

## Project Management
| Agent | Department | Directory | Reports to | Status |
|-------|-----------|-----------|------------|--------|
| Senior Project Manager | PM | agents/pm/senior_project_manager/ | Chief of Staff | Active |
| Risk Manager | PM | agents/pm/risk_manager/ | Senior Project Manager | Active |
| Requirements Analyst | PM | agents/pm/requirements_analyst/ | Senior Project Manager | Active |
| Delivery Manager | PM | agents/pm/delivery_manager/ | Senior Project Manager | Active |

## Engineering
| Agent | Department | Directory | Reports to | Status |
|-------|-----------|-----------|------------|--------|
| VP Engineering | Engineering | agents/engineering/vp_engineering/ | Chief of Staff | Active |
| Solution Architect | Engineering | agents/engineering/solution_architect/ | VP Engineering | Active |
| Dev Team Lead | Engineering | agents/engineering/dev_team_lead/ | Solution Architect | Active |
| Backend Developer | Engineering | agents/engineering/backend_developer/ | Dev Team Lead | Active |
| Frontend Developer | Engineering | agents/engineering/frontend_developer/ | Dev Team Lead | Active |
| DB Engineer | Engineering | agents/engineering/db_engineer/ | Dev Team Lead | Active |
| Mobile Developer | Engineering | agents/engineering/mobile_developer/ | Dev Team Lead | Active |
| Integration Engineer | Engineering | agents/engineering/integration_engineer/ | Dev Team Lead | Active |
| Code Reviewer | Engineering | agents/engineering/code_reviewer/ | Dev Team Lead | Active |
| Technical Writer | Engineering | agents/engineering/technical_writer/ | Dev Team Lead | Active |

## Security
| Agent | Department | Directory | Reports to | Status |
|-------|-----------|-----------|------------|--------|
| Director Security | Security | agents/security/director_security/ | Chief of Staff | Active |
| Security Architect | Security | agents/security/security_architect/ | Director Security | Active |
| Penetration Tester | Security | agents/security/penetration_tester/ | Security Architect | Active |
| SAST/DAST Engineer | Security | agents/security/sast_dast_engineer/ | Security Architect | Active |
| Compliance Auditor | Security | agents/security/compliance_auditor/ | Security Architect | Active |

## QA
| Agent | Department | Directory | Reports to | Status |
|-------|-----------|-----------|------------|--------|
| Director QA | QA | agents/qa/director_qa/ | Chief of Staff | Active |
| Full Stack Tester | QA | agents/qa/full_stack_tester/ | Director QA | Active |
| Performance Tester | QA | agents/qa/performance_tester/ | Full Stack Tester | Active |
| Test Automation Engineer | QA | agents/qa/test_automation_engineer/ | Full Stack Tester | Active |

## DevOps
| Agent | Department | Directory | Reports to | Status |
|-------|-----------|-----------|------------|--------|
| Director DevOps | DevOps | agents/devops/director_devops/ | Chief of Staff | Active |
| Infrastructure Engineer | DevOps | agents/devops/infra_engineer/ | Director DevOps | Active |
| CI/CD Engineer | DevOps | agents/devops/cicd_engineer/ | Infrastructure Engineer | Active |
| Monitoring Engineer | DevOps | agents/devops/monitoring_engineer/ | Infrastructure Engineer | Active |
| Container Engineer | DevOps | agents/devops/container_engineer/ | Infrastructure Engineer | Active |
| SRE | DevOps | agents/devops/sre/ | Infrastructure Engineer | Active |

## Product
| Agent | Department | Directory | Reports to | Status |
|-------|-----------|-----------|------------|--------|
| Product Manager | Product | agents/product/product_manager/ | Chief of Staff | Active |
| UX Designer | Product | agents/product/ux_designer/ | Product Manager | Active |
| UI Designer | Product | agents/product/ui_designer/ | Product Manager | Active |
| Business Analyst | Product | agents/product/business_analyst/ | Product Manager | Active |

## Registry statistics
Total agents: 39
Active: 39
Inactive: 0
Departments: 8

## Full escalation chain (every agent has a path to Atharva)

Individual contributor → Team manager → Senior/Architect → Director/VP → Chief of Staff → [discusses with Guide and Explainer] → Atharva

### Engineering chain
Backend/Frontend/DB/Mobile/Integration/Code Reviewer/Technical Writer
→ Dev Team Lead → Solution Architect → VP Engineering → Chief of Staff → Atharva

### Security chain
Penetration Tester / SAST/DAST Engineer / Compliance Auditor
→ Security Architect → Director Security → Chief of Staff → Atharva

### QA chain
Performance Tester / Test Automation Engineer
→ Full Stack Tester → Director QA → Chief of Staff → Atharva

### DevOps chain
CI/CD Engineer / Monitoring Engineer / Container Engineer / SRE
→ Infrastructure Engineer → Director DevOps → Chief of Staff → Atharva

### HR chain
Agent Performance Manager / Org Designer / Knowledge Manager
→ HR Manager → Chief of Staff → Atharva

### PM chain
Risk Manager / Requirements Analyst / Delivery Manager
→ Senior Project Manager → Chief of Staff → Atharva

### Product chain
UX Designer / UI Designer / Business Analyst
→ Product Manager → Chief of Staff → Atharva
