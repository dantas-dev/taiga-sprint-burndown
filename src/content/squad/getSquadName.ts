export function getSquadName(): string {
  try {
    const squadName = (document.querySelector('.taskboard-header h1 span') as HTMLElement).innerText.split('-')[0].trim().substring(3);
      
    return squadName;
  } catch (error) {
    return 'NOT FOUND';
  }
}