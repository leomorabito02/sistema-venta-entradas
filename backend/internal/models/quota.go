package models

import "time"

type QuotaType string

const (
	QuotaTypePersonal QuotaType = "PERSONAL"
	QuotaTypeFree     QuotaType = "FREE"
)

type SellerQuota struct {
	SellerID      string    `gorm:"type:uuid;primaryKey" json:"seller_id"`
	AssignedQuota int       `gorm:"not null;default:0;check:assigned_quota >= 0" json:"assigned_quota"`
	UsedQuota     int       `gorm:"not null;default:0;check:used_quota >= 0" json:"used_quota"`
	UsedFreeQuota int       `gorm:"not null;default:0;check:used_free_quota >= 0" json:"used_free_quota"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (SellerQuota) TableName() string {
	return "seller_quotas"
}

type GlobalFreeQuota struct {
	ID            int       `gorm:"primaryKey;autoIncrement:false;default:1;check:id = 1" json:"id"`
	TotalFreeQuota int      `gorm:"not null;default:0;check:total_free_quota >= 0" json:"total_free_quota"`
	UsedFreeQuota int       `gorm:"not null;default:0;check:used_free_quota >= 0" json:"used_free_quota"`
	UpdatedAt     time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (GlobalFreeQuota) TableName() string {
	return "global_free_quotas"
}

type QuotaAuditLog struct {
	ID               string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
	AdminID          string    `gorm:"type:uuid;not null" json:"admin_id"`
	SellerID         *string   `gorm:"type:uuid" json:"seller_id,omitempty"`
	QuotaType        QuotaType `gorm:"type:varchar(20);not null;check:quota_type IN ('PERSONAL', 'FREE')" json:"quota_type"`
	PreviousAssigned int       `gorm:"not null;check:previous_assigned >= 0" json:"previous_assigned"`
	NewAssigned      int       `gorm:"not null;check:new_assigned >= 0" json:"new_assigned"`
	CreatedAt        time.Time `gorm:"autoCreateTime" json:"created_at"`
}

func (QuotaAuditLog) TableName() string {
	return "quota_audit_logs"
}

type DefaultQuotaConfig struct {
	ID                   int       `gorm:"primaryKey;autoIncrement:false;default:1;check:id = 1" json:"id"`
	DefaultPersonalQuota int       `gorm:"not null;default:0;check:default_personal_quota >= 0" json:"default_personal_quota"`
	UpdatedAt            time.Time `gorm:"autoUpdateTime" json:"updated_at"`
}

func (DefaultQuotaConfig) TableName() string {
	return "default_quota_configs"
}

type SellerQuotaDetail struct {
	SellerID            string    `json:"seller_id"`
	SellerName          string    `json:"seller_name"`
	SellerEmail         string    `json:"seller_email"`
	AssignedQuota       int       `json:"assigned_quota"`
	UsedQuota           int       `json:"used_quota"`
	RemainingPersonal   int       `json:"remaining_personal"`
	UsedFreeQuota       int       `json:"used_free_quota"`
	IsPersonalExhausted bool      `json:"is_personal_exhausted"`
	UpdatedAt           time.Time `json:"updated_at"`
}

type SellerFreeQuotaUsage struct {
	SellerID      string `json:"seller_id"`
	SellerName    string `json:"seller_name"`
	SellerEmail   string `json:"seller_email"`
	UsedFreeQuota int    `json:"used_free_quota"`
}
