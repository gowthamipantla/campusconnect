import Button from '../common/Button';

export default function RegistrantsTable({
  registrants = [],
  onToggleAttendance,
  updatingId = null,
}) {
  const formatRegistrationDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  if (!registrants || registrants.length === 0) {
    return (
      <div className="bg-white/80 border border-stone/20 rounded-2xl p-8 sm:p-12 text-center">
        <p className="text-stone font-medium text-sm">
          No students have registered for this event yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone/20 rounded-2xl shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ivory/80 border-b border-stone/20 text-xs font-semibold uppercase tracking-wider text-charcoal/80">
              <th className="py-4 px-6">Student</th>
              <th className="py-4 px-6">Roll Number</th>
              <th className="py-4 px-6">Registered On</th>
              <th className="py-4 px-6">Attendance & Certificate</th>
              <th className="py-4 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone/15 text-sm font-body">
            {registrants.map((reg) => {
              const student = reg.user || {};
              const isAttended = Boolean(reg.attended);
              const hasCertificate = Boolean(reg.certificateUrl);
              const isUpdating = updatingId === reg.id;

              return (
                <tr
                  key={reg.id}
                  className="hover:bg-ivory/40 transition-colors duration-150"
                >
                  {/* Student Name & Email */}
                  <td className="py-4 px-6">
                    <div className="font-semibold text-ink">
                      {student.name || 'Anonymous Student'}
                    </div>
                    <div className="text-xs text-stone mt-0.5">
                      {student.email || 'No email provided'}
                    </div>
                  </td>

                  {/* Roll Number */}
                  <td className="py-4 px-6 font-mono text-xs text-charcoal">
                    {student.rollNumber ? (
                      <span className="px-2 py-0.5 rounded bg-charcoal/5 border border-stone/20 font-medium">
                        {student.rollNumber}
                      </span>
                    ) : (
                      <span className="text-stone italic">N/A</span>
                    )}
                  </td>

                  {/* Registered Date */}
                  <td className="py-4 px-6 text-xs text-charcoal/90">
                    {formatRegistrationDate(reg.registeredAt)}
                  </td>

                  {/* Attendance & Certificate Badges */}
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap items-center gap-2">
                      {isAttended ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Attended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone/15 text-stone border border-stone/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-stone" />
                          Registered
                        </span>
                      )}

                      {hasCertificate && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gold/15 text-gold border border-gold/30">
                          <svg
                            className="w-3.5 h-3.5 text-gold shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Certificate Generated
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Toggle Attendance Action Button */}
                  <td className="py-4 px-6 text-right">
                    <Button
                      variant={isAttended ? 'ghost' : 'secondary'}
                      onClick={() => onToggleAttendance(reg.id, isAttended)}
                      disabled={isUpdating}
                      className={`text-xs px-3.5 py-1.5 ${
                        isAttended
                          ? 'text-danger hover:bg-danger/10 border border-danger/30'
                          : 'text-success border-success hover:bg-success/10'
                      }`}
                    >
                      {isUpdating
                        ? 'Updating...'
                        : isAttended
                        ? 'Mark Absent'
                        : 'Mark Attended'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden divide-y divide-stone/15">
        {registrants.map((reg) => {
          const student = reg.user || {};
          const isAttended = Boolean(reg.attended);
          const hasCertificate = Boolean(reg.certificateUrl);
          const isUpdating = updatingId === reg.id;

          return (
            <div key={reg.id} className="p-4 space-y-3 bg-white">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-ink text-sm">
                    {student.name || 'Anonymous Student'}
                  </h4>
                  <p className="text-xs text-stone">{student.email || 'No email'}</p>
                </div>
                {student.rollNumber && (
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-charcoal/5 border border-stone/20">
                    {student.rollNumber}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-charcoal/80 pt-1">
                <span>Registered:</span>
                <span className="font-medium">
                  {formatRegistrationDate(reg.registeredAt)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {isAttended ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success border border-success/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    Attended
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone/15 text-stone border border-stone/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone" />
                    Not Attended
                  </span>
                )}

                {hasCertificate && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gold/15 text-gold border border-gold/30">
                    Certificate Generated
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-stone/10 flex justify-end">
                <Button
                  variant={isAttended ? 'ghost' : 'secondary'}
                  onClick={() => onToggleAttendance(reg.id, isAttended)}
                  disabled={isUpdating}
                  className={`text-xs px-3 py-1.5 w-full ${
                    isAttended
                      ? 'text-danger hover:bg-danger/10 border border-danger/30'
                      : 'text-success border-success hover:bg-success/10'
                  }`}
                >
                  {isUpdating
                    ? 'Updating...'
                    : isAttended
                    ? 'Mark Absent'
                    : 'Mark Attended'}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
