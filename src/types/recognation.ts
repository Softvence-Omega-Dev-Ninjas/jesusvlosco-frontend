export interface IRecognation {
  badgeId: string;
  message: string;
  visibility: string;
  shouldNotify: boolean;
  isAllowedToLike: boolean;
  recognitionUserIds?: {}[];
  createdAt?:string;
  badge?: IBadge
}

export interface IBadge{
    iconImage : string;
    title:string;
    category: string,
    id: string
}
