import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import { db } from "../Firebase/config";
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./MedAdd.css";

const Medicine = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const medicineOptions = [
    { label: "ACETAZOLAMIDE 250 MG", value: "ACETAZOLAMIDE 250 MG" },
    { label: "ALDACTONE 250 MG", value: "ALDACTONE 250 MG" },
    { label: "AMISULPRIDE 100MG", value: "AMISULPRIDE 100MG" },
    { label: "AMISULPRIDE 200 MG", value: "AMISULPRIDE 200 MG" },
    { label: "AMITRIN 25 MG", value: "AMITRIN 25 MG" },
    { label: "AMLODIPINE 5 MG", value: "AMLODIPINE 5 MG" },
    { label: "AMOXILLINE 500 MG", value: "AMOXILLINE 500 MG" },
    { label: "ANASTROZOLE 1MG", value: "ANASTROZOLE 1MG" },
    { label: "ANTACID SUS SYRUP 170ML", value: "ANTACID SUS SYRUP 170ML" },
    { label: "ARIPIPRAZOLE 10MG", value: "ARIPIPRAZOLE 10MG" },
    { label: "ARKAMIN 100MCG", value: "ARKAMIN 100MCG" },
    { label: "ASPIRIN 150MG", value: "ASPIRIN 150MG" },
    { label: "ASPIRIN 75MG", value: "ASPIRIN 75MG" },
    { label: "ATENOLOL 50 MG", value: "ATENOLOL 50 MG" },
    { label: "ATORVASTATIN 10MG", value: "ATORVASTATIN 10MG" },
    { label: "ATORVASTATIN 20 MG", value: "ATORVASTATIN 20 MG" },
    { label: "ATORVASTATIN 40 MG", value: "ATORVASTATIN 40 MG" },
    { label: "ATORVASTATIN. 20 MG", value: "ATORVASTATIN. 20 MG" },
    { label: "ATROTAS INJ", value: "ATROTAS INJ" },
    { label: "AZETHROMYCIN 500", value: "AZETHROMYCIN 500" },
    { label: "AZITHROMYCINE 500 MG", value: "AZITHROMYCINE 500 MG" },
    { label: "AZITROMYSIN 500 MG", value: "AZITROMYSIN 500 MG" },
    { label: "B COMPLEX", value: "B COMPLEX" },
    { label: "BACLOFEN 10MG", value: "BACLOFEN 10MG" },
    { label: "BANDAGE CLOTH10X10CM", value: "BANDAGE CLOTH10X10CM" },
    { label: "BENEDOL 8MG", value: "BENEDOL 8MG" },
    { label: "BESLONE 10(PREDNISOLONE)", value: "BESLONE 10(PREDNISOLONE)" },
    { label: "BETADINE OINT", value: "BETADINE OINT" },
    { label: "BETADINE SOLUTION 500ML", value: "BETADINE SOLUTION 500ML" },
    { label: "BICALUTAMIDE 50 TAB", value: "BICALUTAMIDE 50 TAB" },
    { label: "BIO D3", value: "BIO D3" },
    { label: "BIO D3 PLUS", value: "BIO D3 PLUS" },
    { label: "BLOOD TUBING SET", value: "BLOOD TUBING SET" },
    { label: "BLOOD TUBING SET ( NIPRO)", value: "BLOOD TUBING SET ( NIPRO)" },
    { label: "CALCIUM 500MG +VIT D3", value: "CALCIUM 500MG +VIT D3" },
    { label: "CANAZOLE OINT", value: "CANAZOLE OINT" },
    { label: "CARBAMAZEPINE SR 200MG", value: "CARBAMAZEPINE SR 200MG" },
    { label: "CARBAMAZEPINE SR 300MG", value: "CARBAMAZEPINE SR 300MG" },
    { label: "CARBAMAZEPINE SR 400MG", value: "CARBAMAZEPINE SR 400MG" },
    { label: "CARDIVAS 3.123", value: "CARDIVAS 3.123" },
    { label: "CARDIVAS 3.125", value: "CARDIVAS 3.125" },
    { label: "CEFIXIME 200 MG", value: "CEFIXIME 200 MG" },
    { label: "CEFIXIME 200MG", value: "CEFIXIME 200MG" },
    { label: "CETRIZINE 10 MG", value: "CETRIZINE 10 MG" },
    { label: "CHLORPROMAZINE 100MG", value: "CHLORPROMAZINE 100MG" },
    { label: "CILACAR 10MG", value: "CILACAR 10MG" },
    { label: "CILACAR 20 MG", value: "CILACAR 20 MG" },
    { label: "CILACAR T", value: "CILACAR T" },
    { label: "CILASTASOL 100MG", value: "CILASTASOL 100MG" },
    { label: "CILNIDIPINE 10 MG", value: "CILNIDIPINE 10 MG" },
    { label: "CILNIDIPINE 10+TELMISARTAN40MG", value: "CILNIDIPINE 10+TELMISARTAN40MG" },
    { label: "CILNIDIPINE 20MG", value: "CILNIDIPINE 20MG" },
    { label: "CIPROFLOXACINE 500 MG", value: "CIPROFLOXACINE 500 MG" },
    { label: "CIPROFLOXACINE- 500 MG", value: "CIPROFLOXACINE- 500 MG" },
    { label: "CIPROFLOXCINE 500MG", value: "CIPROFLOXCINE 500MG" },
    { label: "CITALOPRAM 10MG", value: "CITALOPRAM 10MG" },
    { label: "CITALOPRAM 20MG", value: "CITALOPRAM 20MG" },
    { label: "CITALOPRAM 40MG", value: "CITALOPRAM 40MG" },
    { label: "CLOBAZAM 10 MG", value: "CLOBAZAM 10 MG" },
    { label: "CLOBAZAM 5MG", value: "CLOBAZAM 5MG" },
    { label: "CLOMIPRAMINE 50MG", value: "CLOMIPRAMINE 50MG" },
    { label: "CLONAZEPAM 0.25MG", value: "CLONAZEPAM 0.25MG" },
    { label: "CLONAZEPAM 0.5MG", value: "CLONAZEPAM 0.5MG" },
    { label: "CLONAZEPAM 1MG", value: "CLONAZEPAM 1MG" },
    { label: "CLONAZEPAM 2MG", value: "CLONAZEPAM 2MG" },
    { label: "CLOPIDOGREL 75MG", value: "CLOPIDOGREL 75MG" },
    { label: "CLOPILET A", value: "CLOPILET A" },
    { label: "CLOTRIMAZOLE 15GM", value: "CLOTRIMAZOLE 15GM" },
    { label: "CLOZAPINE 100MG", value: "CLOZAPINE 100MG" },
    { label: "CLOZAPINE 200", value: "CLOZAPINE 200" },
    { label: "CLOZAPINE 25", value: "CLOZAPINE 25" },
    { label: "CLOZAPINE 50MG", value: "CLOZAPINE 50MG" },
    { label: "CONTROL D LANCETS", value: "CONTROL D LANCETS" },
    { label: "CORBIS 5 MG", value: "CORBIS 5 MG" },
    { label: "COTTON WOOL I.P", value: "COTTON WOOL I.P" },
    { label: "CREMAFFIN PLUS", value: "CREMAFFIN PLUS" },
    { label: "D3 500 MG", value: "D3 500 MG" },
    { label: "DARIFENACINE 7.5 MG", value: "DARIFENACINE 7.5 MG" },
    { label: "DEBRIN CREAM", value: "DEBRIN CREAM" },
    { label: "DECAMYCIN INJ", value: "DECAMYCIN INJ" },
    { label: "DERIPHLLIN  INJ", value: "DERIPHLLIN  INJ" },
    { label: "DERIPHYLLINE 150 MG", value: "DERIPHYLLINE 150 MG" },
    { label: "DERIPHYLLINE RETARD 150MG", value: "DERIPHYLLINE RETARD 150MG" },
    { label: "DEXONA 4 MG", value: "DEXONA 4 MG" },
    { label: "DEXONA 8 MG", value: "DEXONA 8 MG" },
    { label: "DEXTROSE 25%", value: "DEXTROSE 25%" },
    { label: "DIALYSER  F6", value: "DIALYSER  F6" },
    { label: "DIAZEPAM 5 MG", value: "DIAZEPAM 5 MG" },
    { label: "DICLO GEL", value: "DICLO GEL" },
    { label: "DISPO  20ML SYRINGE(21X1 1/2)", value: "DISPO  20ML SYRINGE(21X1 1/2)" },
    { label: "DISPO 10ML SYRINGE(21X1 1/2)", value: "DISPO 10ML SYRINGE(21X1 1/2)" },
    { label: "DISPO 2.5 ML SYRINGE(24X1)", value: "DISPO 2.5 ML SYRINGE(24X1)" },
    { label: "DISPO 5 ML SYRINGE", value: "DISPO 5 ML SYRINGE" },
    { label: "DOMPERIDONE", value: "DOMPERIDONE" },
    { label: "DONAMEM 10 MG", value: "DONAMEM 10 MG" },
    { label: "DONAMEM 10MG", value: "DONAMEM 10MG" },
    { label: "DONAMEM-10", value: "DONAMEM-10" },
    { label: "DONAPEZIL 5MG", value: "DONAPEZIL 5MG" },
    { label: "DOXOFY 400", value: "DOXOFY 400" },
    { label: "DULOXETINE HCL 20MG", value: "DULOXETINE HCL 20MG" },
    { label: "DUOLIN RESPULES", value: "DUOLIN RESPULES" },
    { label: "DYTOR PLUS", value: "DYTOR PLUS" },
    { label: "EMECET INJ", value: "EMECET INJ" },
    { label: "EMECET TAB 4 MG", value: "EMECET TAB 4 MG" },
    { label: "EMICET TAB 8 MG", value: "EMICET TAB 8 MG" },
    { label: "EPTAIN 100MG", value: "EPTAIN 100MG" },
    { label: "ERYTHROPOETION 4000 IV", value: "ERYTHROPOETION 4000 IV" },
    { label: "ESCITALOPRAM 10MG", value: "ESCITALOPRAM 10MG" },
    { label: "ESCITALOPRAM-5", value: "ESCITALOPRAM-5" },
    { label: "ETHANSYLATE 500MG", value: "ETHANSYLATE 500MG" },
    { label: "EVION 400 CAP", value: "EVION 400 CAP" },
    { label: "EXPECTORENT SYP", value: "EXPECTORENT SYP" },
    { label: "FACE MASK", value: "FACE MASK" },
    { label: "FISTULA NEEDLE 17 NIPRO", value: "FISTULA NEEDLE 17 NIPRO" },
    { label: "FLUCONOZOLE 150MG", value: "FLUCONOZOLE 150MG" },
    { label: "FLUDOCAN INJ", value: "FLUDOCAN INJ" },
    { label: "FLUNIL 10 MG", value: "FLUNIL 10 MG" },
    { label: "FLUOXETINE 20MG", value: "FLUOXETINE 20MG" },
    { label: "FLUOXETINE 40 MG", value: "FLUOXETINE 40 MG" },
    { label: "FOLIC ACID TAB", value: "FOLIC ACID TAB" },
    { label: "FOLLEY'S CATHETER 14", value: "FOLLEY'S CATHETER 14" },
    { label: "FOLLEY'S CATHETER 16", value: "FOLLEY'S CATHETER 16" },
    { label: "FOLLY'S CATHETER-18", value: "FOLLY'S CATHETER-18" },
    { label: "FORACORT.05 RESPULSE", value: "FORACORT.05 RESPULSE" },
    { label: "GABA NT 100-10", value: "GABA NT 100-10" },
    { label: "GABAPENTIN 100MG", value: "GABAPENTIN 100MG" },
    { label: "GABAPENTIN AND NORTRIPTYLINE TAB", value: "GABAPENTIN AND NORTRIPTYLINE TAB" },
    { label: "GAUZE ABSORBENT", value: "GAUZE ABSORBENT" },
    { label: "GLIMEPIRIDE 2MG", value: "GLIMEPIRIDE 2MG" },
    { label: "GLIMEPRIDE 1 MG", value: "GLIMEPRIDE 1 MG" },
    { label: "GLOVES 6.5 NS (SAFEURE)", value: "GLOVES 6.5 NS (SAFEURE)" },
    { label: "GLOVES 6.5 STE", value: "GLOVES 6.5 STE" },
    { label: "GLOVES 6.5 STE(SAFESURE)", value: "GLOVES 6.5 STE(SAFESURE)" },
    { label: "GLOVES 7 STE SURGICARE", value: "GLOVES 7 STE SURGICARE" },
    { label: "GLOVES 7.5 STE(SAFESURE)", value: "GLOVES 7.5 STE(SAFESURE)" },
    { label: "HALOPERIDOL 10MG", value: "HALOPERIDOL 10MG" },
    { label: "HALOPERIDOL 5 MG", value: "HALOPERIDOL 5 MG" },
    { label: "HYDROCORTISONE 10MG", value: "HYDROCORTISONE 10MG" },
    { label: "INHALER 200 TIOVA", value: "INHALER 200 TIOVA" },
    { label: "INHALER FORACORT  200", value: "INHALER FORACORT  200" },
    { label: "INJ        METACLOPRAMIDE", value: "INJ        METACLOPRAMIDE" },
    { label: "INJ       HYDROCORTISONE 100MG", value: "INJ       HYDROCORTISONE 100MG" },
    { label: "INJ FLUDECAN", value: "INJ FLUDECAN" },
    { label: "INJ KETROLAC", value: "INJ KETROLAC" },
    { label: "INJ LORAZEPAM", value: "INJ LORAZEPAM" },
    { label: "INJ.  HEPARIN", value: "INJ.  HEPARIN" },
    { label: "INJ. DICLOFINAC", value: "INJ. DICLOFINAC" },
    { label: "INJ. HALOPERIDOLE", value: "INJ. HALOPERIDOLE" },
    { label: "INJ. IRON SUCROSS", value: "INJ. IRON SUCROSS" },
    { label: "INJ. PHENERGAN 2ML", value: "INJ. PHENERGAN 2ML" },
    { label: "INJ. RISPERIDONE", value: "INJ. RISPERIDONE" },
    { label: "INJ. TRAMADOLE", value: "INJ. TRAMADOLE" },
    { label: "INJ.,LIGNOCANE 2%", value: "INJ.,LIGNOCANE 2%" },
    { label: "INJ.DERIPHYLLINE", value: "INJ.DERIPHYLLINE" },
    { label: "INJ.DIAZPAM 2ML", value: "INJ.DIAZPAM 2ML" },
    { label: "INJ.ETHAMSYLATE", value: "INJ.ETHAMSYLATE" },
    { label: "INJ.FRUSIMAIDE", value: "INJ.FRUSIMAIDE" },
    { label: "INJ.NS  3%", value: "INJ.NS  3%" },
    { label: "INJ.RANTAC 2ML", value: "INJ.RANTAC 2ML" },
    { label: "INSULIN 50/50", value: "INSULIN 50/50" },
    { label: "ISOSORBID 10 TAB", value: "ISOSORBID 10 TAB" },
    { label: "IV.CANULA KITKATH 22GX1", value: "IV.CANULA KITKATH 22GX1" },
    { label: "IV.FLUID D5", value: "IV.FLUID D5" },
    { label: "IV.FLUID DNS", value: "IV.FLUID DNS" },
    { label: "JULAX 10 MG", value: "JULAX 10 MG" },
    { label: "JULAX 10MG", value: "JULAX 10MG" },
    { label: "LAMOTRIGINE 100MG", value: "LAMOTRIGINE 100MG" },
    { label: "LASILACTONE 50MG", value: "LASILACTONE 50MG" },
    { label: "LASIX TAB", value: "LASIX TAB" },
    { label: "LETROZOLE 2.5MG", value: "LETROZOLE 2.5MG" },
    { label: "LEVIPIL 500", value: "LEVIPIL 500" },
    { label: "LEVO CETRICINE 5 MG", value: "LEVO CETRICINE 5 MG" },
    { label: "LIGNOCAIN 2%", value: "LIGNOCAIN 2%" },
    { label: "LIGNOCAIN JELLY 30GM", value: "LIGNOCAIN JELLY 30GM" },
    { label: "LIQUID PARAFFIN IP", value: "LIQUID PARAFFIN IP" },
    { label: "LITHIUM CARBONATE 300MG", value: "LITHIUM CARBONATE 300MG" },
    { label: "LITHIUM CARBONATE 400MG", value: "LITHIUM CARBONATE 400MG" },
    { label: "LIVOGEN 300 MG", value: "LIVOGEN 300 MG" },
    { label: "LORAZEPAM 1MG", value: "LORAZEPAM 1MG" },
    { label: "LORAZEPAM 2MG", value: "LORAZEPAM 2MG" },
    { label: "LOSARTAN 50 MG", value: "LOSARTAN 50 MG" },
    { label: "M SOL", value: "M SOL" },
    { label: "MEDI GRIP  MICRO PALASTER 2.5", value: "MEDI GRIP  MICRO PALASTER 2.5" },
    { label: "MEGAHEAL GEL", value: "MEGAHEAL GEL" },
    { label: "MELOXICAM 15 MG", value: "MELOXICAM 15 MG" },
    { label: "METACLOPRAMIDE", value: "METACLOPRAMIDE" },
    { label: "METFORMIN 500MG", value: "METFORMIN 500MG" },
    { label: "METFORMIN HCL 850MG", value: "METFORMIN HCL 850MG" },
    { label: "METOPROLOL 50 TAB", value: "METOPROLOL 50 TAB" },
    { label: "METROGYL 400MG", value: "METROGYL 400MG" },
    { label: "METROGYL GEL.", value: "METROGYL GEL." },
    { label: "METROGYL IV 100ML", value: "METROGYL IV 100ML" },
    { label: "METRONIDAZOLE", value: "METRONIDAZOLE" },
    { label: "MICRO PLASTER 2.5CM", value: "MICRO PLASTER 2.5CM" },
    { label: "MIRTAZEPINE 15MG", value: "MIRTAZEPINE 15MG" },
    { label: "MONTEK LC", value: "MONTEK LC" },
    { label: "MONTELUKAST SODIUM LC10MG", value: "MONTELUKAST SODIUM LC10MG" },
    { label: "MOXCLAV 625MG", value: "MOXCLAV 625MG" },
    { label: "MULTI VITAMIN", value: "MULTI VITAMIN" },
    { label: "NEEDLE.18", value: "NEEDLE.18" },
    { label: "NEL -CATH FG 12", value: "NEL -CATH FG 12" },
    { label: "NELCATH-10", value: "NELCATH-10" },
    { label: "NEUROBION FORTE TAB", value: "NEUROBION FORTE TAB" },
    { label: "NICARDIA 20MG", value: "NICARDIA 20MG" },
    { label: "NITROFURANTION", value: "NITROFURANTION" },
    { label: "NITROGLYCERIN", value: "NITROGLYCERIN" },
    { label: "NODOSIS -500", value: "NODOSIS -500" },
    { label: "NODOSIS -DAS TAB", value: "NODOSIS -DAS TAB" },
    { label: "NS 3%", value: "NS 3%" },
    { label: "NS 500ML", value: "NS 500ML" },
    { label: "OLANZEPINE 10MG", value: "OLANZEPINE 10MG" },
    { label: "OLANZEPINE 5MG", value: "OLANZEPINE 5MG" },
    { label: "OMESEC 20 CAP", value: "OMESEC 20 CAP" },
    { label: "ONE TOUCH SELECT STRIP", value: "ONE TOUCH SELECT STRIP" },
    { label: "OPIPRAMOL 50MG", value: "OPIPRAMOL 50MG" },
    { label: "OPIPROMOL-50", value: "OPIPROMOL-50" },
    { label: "OXCARBAZEPINE 300MG", value: "OXCARBAZEPINE 300MG" },
    { label: "OXYS PAS 5 MG", value: "OXYS PAS 5 MG" },
    { label: "OXYSPAS 5MG", value: "OXYSPAS 5MG" },
    { label: "PANTO 40INJ", value: "PANTO 40INJ" },
    { label: "PANTO TAB 40MG", value: "PANTO TAB 40MG" },
    { label: "PANTOPRAZOLE40+DOMPERIDONE30SR", value: "PANTOPRAZOLE40+DOMPERIDONE30SR" },
    { label: "PARACETAMOL 650 TAB", value: "PARACETAMOL 650 TAB" },
    { label: "PARACITAMOLE 500 MG", value: "PARACITAMOLE 500 MG" },
    { label: "PARKIN 2MG", value: "PARKIN 2MG" },
    { label: "PETRIL BETA 20 TAB", value: "PETRIL BETA 20 TAB" },
    { label: "PETRIL BETA 20MG", value: "PETRIL BETA 20MG" },
    { label: "PGM CAPS", value: "PGM CAPS" },
    { label: "PHENERGAN 25", value: "PHENERGAN 25" },
    { label: "PHOSTATE", value: "PHOSTATE" },
    { label: "PIOGLITAZONE 15MG", value: "PIOGLITAZONE 15MG" },
    { label: "PRAZOSIN XL 5MG", value: "PRAZOSIN XL 5MG" },
    { label: "PREGABALIN 75 MG", value: "PREGABALIN 75 MG" },
    { label: "PROPANALOL 20MG", value: "PROPANALOL 20MG" },
    { label: "QUETIAPINE 100MG", value: "QUETIAPINE 100MG" },
    { label: "QUETIAPINE 200 MG", value: "QUETIAPINE 200 MG" },
    { label: "QUETIAPINE 25MG", value: "QUETIAPINE 25MG" },
    { label: "QUETIAPINE 50MG", value: "QUETIAPINE 50MG" },
    { label: "RABEPRAZ  L CAP", value: "RABEPRAZ  L CAP" },
    { label: "RANOLAZIN 500 MG", value: "RANOLAZIN 500 MG" },
    { label: "RANTAC  TAB 150 MG", value: "RANTAC  TAB 150 MG" },
    { label: "RENOSAVE", value: "RENOSAVE" },
    { label: "RISPERIDONE 0.5 MG", value: "RISPERIDONE 0.5 MG" },
    { label: "RISPERIDONE 1MG", value: "RISPERIDONE 1MG" },
    { label: "RISPERIDONE 2MG", value: "RISPERIDONE 2MG" },
    { label: "RISPERIDONE 3MG", value: "RISPERIDONE 3MG" },
    { label: "RISPERIDONE 4MG", value: "RISPERIDONE 4MG" },
    { label: "RISPERIDONE FORTE", value: "RISPERIDONE FORTE" },
    { label: "RISPERIDONE LS", value: "RISPERIDONE LS" },
    { label: "RISPERIDONE PLUS", value: "RISPERIDONE PLUS" },
    { label: "RISPERIDONE SOLUTION", value: "RISPERIDONE SOLUTION" },
    { label: "RL IV 500 ML", value: "RL IV 500 ML" },
    { label: "RL IV 500ML", value: "RL IV 500ML" },
    { label: "RMS INFUSION SET (IV SET)", value: "RMS INFUSION SET (IV SET)" },
    { label: "ROSVASTATIN 10 MG", value: "ROSVASTATIN 10 MG" },
    { label: "ROSVASTATIN 10MG", value: "ROSVASTATIN 10MG" },
    { label: "RYLES TUBE", value: "RYLES TUBE" },
    { label: "RYLES TUBE.14", value: "RYLES TUBE.14" },
    { label: "SAZOLET 500 TAB", value: "SAZOLET 500 TAB" },
    { label: "SCALPVAN SET (HMD)", value: "SCALPVAN SET (HMD)" },
    { label: "SERTALINE 100MG", value: "SERTALINE 100MG" },
    { label: "SERTALINE 50MG", value: "SERTALINE 50MG" },
    { label: "SODIUM PHOSPHATE ENEMA 100ML", value: "SODIUM PHOSPHATE ENEMA 100ML" },
    { label: "SODIUM VALPORATE CR 300MG", value: "SODIUM VALPORATE CR 300MG" },
    { label: "SODIUM VALPORTE 200MG", value: "SODIUM VALPORTE 200MG" },
    { label: "SODIUM VALPROTE +VALPROIC ACID 500", value: "SODIUM VALPROTE +VALPROIC ACID 500" },
    { label: "STERILE WATER", value: "STERILE WATER" },
    { label: "STUGIRONE", value: "STUGIRONE" },
    { label: "SURGICAL BLADE 15", value: "SURGICAL BLADE 15" },
    { label: "SURGICAL BLADE 22", value: "SURGICAL BLADE 22" },
    { label: "SYCLOPAM TAB", value: "SYCLOPAM TAB" },
    { label: "SYNDOPA 110 TAB", value: "SYNDOPA 110 TAB" },
    { label: "T .SUCRAWIN", value: "T .SUCRAWIN" },
    { label: "T, METHOTRASETE 15 MG", value: "T, METHOTRASETE 15 MG" },
    { label: "T. H.C.Q.S 200MG", value: "T. H.C.Q.S 200MG" },
    { label: "T. LEVOFLOXACINE 500 MG", value: "T. LEVOFLOXACINE 500 MG" },
    { label: "T.DICLOFINAC 50MG", value: "T.DICLOFINAC 50MG" },
    { label: "T.ENVAS 5 MG", value: "T.ENVAS 5 MG" },
    { label: "T.FEMBRO 2.5 MG", value: "T.FEMBRO 2.5 MG" },
    { label: "TAMOXAFIN 20MG", value: "TAMOXAFIN 20MG" },
    { label: "TAMSULOSIN 0.4MG", value: "TAMSULOSIN 0.4MG" },
    { label: "TELMI CTH 40 TAB", value: "TELMI CTH 40 TAB" },
    { label: "TELMISARTAN 40MG", value: "TELMISARTAN 40MG" },
    { label: "THYROXIN 100MG", value: "THYROXIN 100MG" },
    { label: "THYROXINE 25MG", value: "THYROXINE 25MG" },
    { label: "THYROXINE 50MG", value: "THYROXINE 50MG" },
    { label: "TOP O PLAST", value: "TOP O PLAST" },
    { label: "TOPIRAMATE 100MG", value: "TOPIRAMATE 100MG" },
    { label: "TORSEMIDE 10TAB", value: "TORSEMIDE 10TAB" },
    { label: "TRAMADOLE 50", value: "TRAMADOLE 50" },
    { label: "TRAMADOLE CAP 50", value: "TRAMADOLE CAP 50" },
    { label: "TRANSDUCER PROTECTOR-JET", value: "TRANSDUCER PROTECTOR-JET" },
    { label: "ULTRACET TAB", value: "ULTRACET TAB" },
    { label: "URIN BAG", value: "URIN BAG" },
    { label: "VENLAFAXINE 150", value: "VENLAFAXINE 150" },
    { label: "VENLAFAXINE 37.5", value: "VENLAFAXINE 37.5" },
    { label: "VENLAFAXINE 75", value: "VENLAFAXINE 75" },
    { label: "VERTILINE 8 MG", value: "VERTILINE 8 MG" },
    { label: "VITAMIN B COMPLEX", value: "VITAMIN B COMPLEX" },
    { label: "XAM CARE (M)", value: "XAM CARE (M)" },
    { label: "ZOLPIDEM 10MG", value: "ZOLPIDEM 10MG" },
  ];

  const [formFields, setFormFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientQuery = query(collection(db, "Patients"), where("patientId", "==", patientId));
        const patientSnapshot = await getDocs(patientQuery);

        if (!patientSnapshot.empty) {
          const data = patientSnapshot.docs[0].data();
          setPatientData(data);
        } else {
          console.error("No patient document found with patientId:", patientId);
        }

        const medicineQuery = query(collection(db, "Medicines"), where("patientId", "==", patientId));
        const medicineSnapshot = await getDocs(medicineQuery);

        if (!medicineSnapshot.empty) {
          const medicinesData = medicineSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setMedicines(medicinesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const handleInputChange = (index, name, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][name] = value;
    setFormFields(updatedFields);
  };

  const addMedicineField = () => {
    setFormFields([...formFields, { medicine: null, newMedicine: "", quantity: "", time: "Morning", patientsNow: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentDate = new Date().toISOString();

      const medicinesData = formFields.map((field) => ({
        medicineName: field.newMedicine || field.medicine?.value,
        quantity: field.quantity,
        time: field.time,
        patientsNow: field.patientsNow,
      }));

      if (isEditing) {
        const medicineRef = doc(db, "Medicines", medicines[0].id); // Assuming only one entry per patient
        await updateDoc(medicineRef, { medicines: medicinesData });
        toast.success("Medicines updated successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        const reportData = {
          patientId,
          patientDetails: patientData,
          medicines: medicinesData,
          submittedAt: currentDate,
        };
        await addDoc(collection(db, "Medicines"), reportData);
        toast.success("Medicines saved successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      setMedicines(medicinesData);
      setFormFields([]);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving medicines:", error);
      toast.error("Error saving medicines. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="MedAdd-container">
      <button className="MedAdd-backButton" onClick={() => navigate(-1)}>
        &larr; Back
      </button>
      <h2 className="MedAdd-title">Manage Medicines for Patient ID: {patientId}</h2>
      {patientData ? (
        <div className="MedAdd-patientInfo">
          <h3>Patient Information</h3>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Address:</strong> {patientData.address}</p>
          <p><strong>Phone:</strong> {patientData.phone}</p>
        </div>
      ) : (
        <p>Loading patient information...</p>
      )}

      {medicines.length > 0 ? (
        <div className="MedAdd-existingMedicines">
          <h3>Existing Medicines</h3>
          <table className="MedAdd-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Quantity</th>
                <th>Time</th>
                <th>Patients Show</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length > 0 && medicines[0].medicines ? (
                medicines[0].medicines.map((medicine, index) => (
                  <tr key={index}>
                    <td data-label="Medicine Name">{medicine.medicineName}</td>
                    <td data-label="Quantity">{medicine.quantity}</td>
                    <td data-label="Time">{medicine.time}</td>
                    <td data-label="Patients Now">{medicine.patientsNow ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No medicines available.</td>
                </tr>
              )}
            </tbody>
          </table>

          <button
            onClick={() => navigate(`/main/update-medicines/${patientId}`)} // Navigate to the update route
            className="MedAdd-updateButton"
          >
            Update Medicines
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="MedAdd-form">
          <h3>Add Medicines</h3>
          {formFields.map((field, index) => (
            <div key={index} className="MedAdd-field">
              <label>
                Medicine Name:
                <Select
                  options={medicineOptions}
                  value={field.medicine}
                  onChange={(selectedOption) => handleInputChange(index, "medicine", selectedOption)}
                  placeholder="Select Medicine"
                  isClearable
                />
                <span>or Add New:</span>
                <input
                  type="text"
                  name="newMedicine"
                  value={field.newMedicine}
                  placeholder="New Medicine"
                  onChange={(e) => handleInputChange(index, "newMedicine", e.target.value)}
                />
              </label>
              <label>
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={field.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                />
              </label>
              <label>
                Time:
                <select
                  name="time"
                  value={field.time}
                  onChange={(e) => handleInputChange(index, "time", e.target.value)}
                >
                  <option value="Mor-Noon-Eve">Mor-Noon-Eve</option>
                  <option value="Mor-Noon">Mor-Noon</option>
                  <option value="Mor-Eve">Mor-Eve</option>
                  <option value="Noon-Eve">Noon-Eve</option>
                  <option value="Mor">Morning</option>
                  <option value="Noon">Noon</option>
                  <option value="Eve">Evening</option>
                  <option value="SOS">SOS</option>
                  <option value="If Required">If Required</option>
                </select>
              </label>
              <label>
                Patients Show:
                <input
                  type="checkbox"
                  name="patientsNow"
                  checked={field.patientsNow}
                  onChange={(e) => handleInputChange(index, "patientsNow", e.target.checked)}
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={addMedicineField} className="MedAdd-addButton">
            Add More
          </button>
          <button type="submit" className="MedAdd-submitButton" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save Medicines"}
          </button>
        </form>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default Medicine;